export const formatDateTime = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    let hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'pm' : 'am'
    
    hours = hours % 12
    hours = hours ? hours : 12 // 0 should be 12
    
    return `${day}-${month}-${year} ${hours}:${minutes}${ampm}`
  }
