import axios from 'axios';

async function fetchUsersInBatch(userIds: string[]): Promise<User[]> {
  try {
    const response = await axios.post('http://localhost:3004/', {
      ids: userIds,
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    // Depending on your application's needs, you might want to throw the error,
    // return an empty array, or return a fallback value for users.
    throw error;
  }
}

async function fetchLikesDataForUser(
  userId: string,
  postIds: number[]
): Promise<{ [postId: string]: boolean }> {
  try {
    const response = await axios.post(
      'http://localhost:3001/utils/user/likes',
      { userId: userId, postsIds: postIds }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch likes data:', error);
    throw error;
  }
}
export { fetchUsersInBatch, fetchLikesDataForUser };
