export const getFolderName = (event) => {
    if (!event) return '';
    if (event.folder) return event.folder;
    return `${event.date.replace(/-/g, '')}_${event.name.toLowerCase().replace(/\s+/g, '')}`;
};
