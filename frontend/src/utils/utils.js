export const formatTime = (seconds) => {
    if (seconds && typeof seconds === 'number') {
        seconds = parseInt(seconds)

        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60

        return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`
    }
    return '0:00'
}