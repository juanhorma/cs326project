export const toBuddyDto = (buddy) => ({
  id: buddy._id.toString(),
  name: buddy.name,
  certification: buddy.certification,
  email: buddy.email,
});
