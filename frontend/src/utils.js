function compareUsersList(friends) {
  return function compare(user1, user2) {
    const user1Friend =
      friends && friends.find((friend) => friend.user2 === user1.id);
    const user2Friend =
      friends && friends.find((friend) => friend.user2 === user2.id);

    if (
      (!user1Friend && !user2Friend) ||
      (user1Friend?.accepted && user2Friend?.accepted)
    ) {
      return -1;
    } else if (
      (user1Friend && !user2Friend) ||
      (user1Friend?.accepted && !user2Friend?.accepted)
    ) {
      return 0;
    } else {
      return 1;
    }
  };
}

export { compareUsersList };
