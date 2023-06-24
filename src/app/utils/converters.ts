export function dateFormatter(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year:"numeric",
      timeZone: 'UTC'
    };
  
    const formattedDate = new Intl.DateTimeFormat('tr-TR', options).format(new Date(date));
    return formattedDate;
  }

  
  export function formatPhoneNumberValue(phoneNumber: string): string {
    const countryCode = phoneNumber.slice(0, 3);
    const areaCode = phoneNumber.slice(3, 6);
    const part1 = phoneNumber.slice(6, 9);
    const part2 = phoneNumber.slice(9, 11);
    const part3 = phoneNumber.slice(11, 13);
    return `${countryCode} ${areaCode} ${part1} ${part2} ${part3}`;
  }