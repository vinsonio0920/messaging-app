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

function sortPendingAcceptance(friends, currentUser) {
  // basically place pending acceptance users on top
  return function compare(user1, user2) {
    const pendingAcceptance1 =
      friends &&
      friends.find(
        (friend) =>
          friend.user1 === user1.id && friend.user2 === Number(currentUser.id),
      );
    const pendingAcceptance2 =
      friends &&
      friends.find(
        (friend) =>
          friend.user1 === user2.id && friend.user2 === Number(currentUser.id),
      );

    if (pendingAcceptance1 && !pendingAcceptance1) {
      return -1;
    } else if (!pendingAcceptance1 && pendingAcceptance2) {
      return 1;
    } else {
      return 0;
    }
  };
}

export { compareUsersList, sortPendingAcceptance };
