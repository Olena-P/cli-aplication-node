const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve("./db/contacts.json");

const readContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

async function listContacts() {
  try {
    const contacts = await readContacts();

    console.table(contacts);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await readContacts();

    const contact = contacts.find(
      (contact) => String(contact.id) === String(contactId)
    );

    if (!contact) throw new Error("Contact not found");
    console.table(contact);
  } catch (error) {
    console.log(error.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = await readContacts();
    const contact = await getContactById(contactId);

    if (!contact) return;

    console.log("Removing a contact...");

    await fs.writeFile(
      contactsPath,
      JSON.stringify(
        contacts.filter((contact) => String(contact.id) !== String(contactId)),
        null,
        2
      )
    );

    console.table(await readContacts());
    console.log("The contact has been successfully deleted");
  } catch (error) {
    console.log(error.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await readContacts();
    const id = nanoid();
    const contact = { id, name, email, phone };

    console.log("Adding a contact...");
    console.table(contact);

    await fs.writeFile(
      contactsPath,
      JSON.stringify([...contacts, contact], null, 2)
    );

    console.table(await readContacts());
    console.log("The contact has been successfully added");
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };
