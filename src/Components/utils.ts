import toast from 'react-hot-toast';

export const saveNotify = (item: string) => toast(`Saved ${item} on Spotify`);
export const unsaveNotify = (item: string) =>
  toast(`Removed ${item} from Saved`);
export const followNotify = (artist: string) =>
  toast(`Now following ${artist} on Spotify`);
export const unfollowNotify = (artist: string) =>
  toast(`Unfollowed ${artist} on Spotify`);
export const addToBuildNotify = (item: string) =>
  toast(`Added ${item} to Your Current Build!`);
