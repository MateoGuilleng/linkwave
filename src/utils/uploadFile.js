import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { storage } from '../config/firebase.js'
import { NextResponse } from 'next/server.js';

export async function uploadFile(file) {
    try {
        console.log('File object:', file);
        console.log('Uploading to Firebase Storage...');

        // Eliminamos el uso de Sharp y simplemente trabajamos con el buffer del archivo directamente
        const fileBuffer = file.buffer;

        const fileRef = ref(storage, `files/${file.originalname} ${Date.now()}`);
        const fileMetadata = { contentType: file.type };

        // Cambiamos esta línea para obtener la tarea de carga (UploadTask)
        const uploadTask = uploadBytesResumable(
            fileRef,
            fileBuffer,
            fileMetadata
        );

        // Esperamos la finalización de la tarea de carga
        await uploadTask;

        console.log('Getting download URL...');
        const fileDownloadURL = await getDownloadURL(fileRef);

        console.log('File upload successful.');
        return NextResponse.json({ ref: fileRef, downloadURL: fileDownloadURL })
    } catch (error) {
        console.error('Error uploading file:', error);

        return NextResponse.json({ error })
    }
}