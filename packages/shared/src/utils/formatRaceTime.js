export const formatRaceTime = (entry) => {
    if (!entry.startTime || !entry.finishTime) return '00:00:00';
    const elapsed = Math.floor((entry.finishTime - entry.startTime) / 1000);
    const hrs = Math.floor(elapsed / 3600);
    const mins = Math.floor((elapsed % 3600) / 60);
    const secs = elapsed % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};