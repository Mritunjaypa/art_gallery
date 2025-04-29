import {surpriseMePrompts} from '../constants/index.js';
import FileSaver from 'file-saver';

export default function getRandomPrompt(prompt) {
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
    const randomPrompt = surpriseMePrompts[randomIndex];

    if(randomPrompt === prompt)
        return getRandomPrompt(prompt);

    return randomPrompt;
}

export async function downloadImage(id, photo) {
    // Determine file extension from the data URL
    let extension = 'jpg'; // Default
    
    if (photo.startsWith('data:image/svg')) {
        extension = 'svg';
    } else if (photo.startsWith('data:image/png')) {
        extension = 'png';
    } else if (photo.startsWith('data:image/jpeg') || photo.startsWith('data:image/jpg')) {
        extension = 'jpg';
    } else if (photo.startsWith('data:image/gif')) {
        extension = 'gif';
    }
    
    FileSaver.saveAs(photo, `download-${id}.${extension}`);
}