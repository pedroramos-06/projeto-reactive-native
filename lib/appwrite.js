import { Client, Account, Avatars, Databases } from "react-native-appwrite";

export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('68c9b6160008f8af3932')
    .setPlatform('com.pedro.shelfie');

export const account = new Account(client)
export const avatars = new Avatars(client)
export const databases = new Databases(client)
