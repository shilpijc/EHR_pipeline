// Email masking utility
// Masks email like "R***_22@G_**[L.com](http://L.com)"

export const maskEmail = (email) => {
  if (!email) return '';
  const [localPart, domain] = email.split('@');
  if (!domain) return email; // Invalid email format
  
  // Mask local part: keep first character, star out middle, keep last 2-3 characters if they exist
  let maskedLocal;
  if (localPart.length <= 2) {
    maskedLocal = localPart[0] + '*';
  } else if (localPart.length <= 4) {
    maskedLocal = localPart[0] + '*'.repeat(localPart.length - 1);
  } else {
    // Keep first char, star out middle, keep last 2 chars
    maskedLocal = localPart[0] + '*'.repeat(Math.max(2, localPart.length - 3)) + localPart.slice(-2);
  }
  
  // Mask domain: keep first character, star out middle, keep TLD
  const domainParts = domain.split('.');
  if (domainParts.length < 2) return email; // Invalid domain format
  
  const tld = domainParts[domainParts.length - 1];
  const domainName = domainParts.slice(0, -1).join('.');
  
  let maskedDomainName;
  if (domainName.length <= 1) {
    maskedDomainName = domainName[0] + '*';
  } else {
    // Keep first char, star out middle (2 stars), keep last char if available
    maskedDomainName = domainName[0] + '**' + (domainName.length > 2 ? domainName.slice(-1) : '');
  }
  
  return `${maskedLocal}@${maskedDomainName}.${tld}`;
};

