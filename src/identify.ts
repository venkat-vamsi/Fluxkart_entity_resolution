import { Request, Response } from "express";
import { Contact, LinkPrecedence } from "./Contact";
import { AppDataSource } from "./data-source";

export const identify = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;
    const contactRepo = AppDataSource.getRepository(Contact);

    // 1. Find all contacts that match EITHER email OR phone
    let existingContacts = await contactRepo.find({
        where: [
            { email: email },
            { phoneNumber: phoneNumber }
        ]
    });

    // FILTER: If inputs are null, don't match on nulls in DB
    existingContacts = existingContacts.filter(c => 
        (email && c.email === email) || (phoneNumber && c.phoneNumber === phoneNumber)
    );

    // CASE 0: No match found -> Create new PRIMARY
    if (existingContacts.length === 0) {
        const newContact = contactRepo.create({
            email,
            phoneNumber,
            linkPrecedence: LinkPrecedence.PRIMARY
        });
        await contactRepo.save(newContact);
        return res.status(200).json(formatResponse(newContact, []));
    }

    // 2. Finding the ROOT (Primary) for all matched contacts.
    
    const distinctPrimaryIds = new Set<number>();
    existingContacts.forEach(c => {
        if (c.linkPrecedence === LinkPrecedence.PRIMARY) {
            distinctPrimaryIds.add(c.id);
        } else if (c.linkedId) {
            distinctPrimaryIds.add(c.linkedId);
        }
    });

    let primaryContacts = await contactRepo.findByIds(Array.from(distinctPrimaryIds));
    
    primaryContacts.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    const primaryContact = primaryContacts[0]; // The winner

    // CASE 1: Merging Logic
    if (primaryContacts.length > 1) {
        for (let i = 1; i < primaryContacts.length; i++) {
            const contactToDemote = primaryContacts[i];
            
            // 1. Update the demoted primary itself
            contactToDemote.linkPrecedence = LinkPrecedence.SECONDARY;
            contactToDemote.linkedId = primaryContact.id;
            await contactRepo.save(contactToDemote);

            // 2. Update all its children to point to the NEW primary
            await contactRepo.createQueryBuilder()
                .update(Contact)
                .set({ linkedId: primaryContact.id })
                .where("linkedId = :oldId", { oldId: contactToDemote.id })
                .execute();
        }
    }

    // 3. Handle New Information (Create Secondary)
    
    const allContacts = await contactRepo.find({
        where: [
            { id: primaryContact.id },
            { linkedId: primaryContact.id }
        ]
    });

    const emails = new Set(allContacts.map(c => c.email).filter(Boolean));
    const phones = new Set(allContacts.map(c => c.phoneNumber).filter(Boolean));

    const isNewEmail = email && !emails.has(email);
    const isNewPhone = phoneNumber && !phones.has(phoneNumber);

    if (isNewEmail || isNewPhone) {
        const newSecondary = contactRepo.create({
            email,
            phoneNumber,
            linkedId: primaryContact.id,
            linkPrecedence: LinkPrecedence.SECONDARY
        });
        await contactRepo.save(newSecondary);
        allContacts.push(newSecondary); 
    }

    // 4. Format Response
    return res.status(200).json(formatResponse(primaryContact, allContacts));
};

// Helper function to format the JSON response exactly as requested
const formatResponse = (primary: Contact, others: Contact[]) => {
    const emails = new Set<string>();
    const phones = new Set<string>();
    const secondaryIds: number[] = [];

    if (primary.email) emails.add(primary.email);
    if (primary.phoneNumber) phones.add(primary.phoneNumber);

    others.forEach(c => {
        if (c.email) emails.add(c.email);
        if (c.phoneNumber) phones.add(c.phoneNumber);
        if (c.linkPrecedence === LinkPrecedence.SECONDARY) {
            secondaryIds.push(c.id);
        }
    });

    return {
        contact: {
            primaryContatctId: primary.id,
            emails: Array.from(emails),
            phoneNumbers: Array.from(phones),
            secondaryContactIds: [...new Set(secondaryIds)]
        }
    };
};