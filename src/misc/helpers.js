export function reformatErrorMessage(errorMsg) {
  try {
    const filterStart = errorMsg.indexOf('Filters: ');
    if (filterStart === -1) return errorMsg;

    const jsonStart = errorMsg.indexOf('{', filterStart);
    const jsonString = errorMsg.slice(jsonStart, -1);
    const parsedFilters = JSON.parse(JSON.parse(`"${jsonString}"`));
    const formattedFilters = JSON.stringify(parsedFilters, null, 2);

    return (
      errorMsg.slice(0, filterStart) +
      'Filters:\n' +
      formattedFilters.replaceAll('\\', '')
    );
  } catch (e) {
    return errorMsg;
  }
}

export function reformatBuildNumber(str) {
  return String(str).replace(/(\d{4})(\d{2})(\d{2})\.(\d+)/, '$1/$2/$3.$4');
}

export function timeAgo(dateString) {
  const eventDate = new Date(dateString);
  const now = new Date();

  const elapsedMs = now.getTime() - eventDate.getTime();

  const seconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
}

export function updateFavicon(isGreen) {
  const link =
    document.querySelector('link[rel*=icon]') || document.createElement('link');
  link.rel = 'icon';
  link.href = isGreen ? '/green.ico' : '/red.ico';
  document.head.appendChild(link);
}

export function updateBuildNumberInUrl(buildNumber) {
  const url = new URL(window.location.href);
  if (buildNumber) {
    url.searchParams.set('build', buildNumber);
  } else {
    url.searchParams.delete('build');
  }
  window.history.replaceState({}, document.title, url.toString());
}
