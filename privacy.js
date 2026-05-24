const footerYear = document.getElementById('footer-year');
const updatedDate = document.getElementById('privacy-last-updated');

if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

if (updatedDate) {
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());
  updatedDate.textContent = formattedDate;
}
