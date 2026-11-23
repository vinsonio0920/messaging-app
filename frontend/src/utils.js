import { format } from "date-fns";

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

function sortFriendsList(selectedFriends) {
  return function compare(friend1, friend2) {
    if (
      selectedFriends.includes(String(friend1.id)) &&
      !selectedFriends.includes(String(friend2.id))
    ) {
      return -1;
    } else if (
      !selectedFriends.includes(String(friend1.id)) &&
      selectedFriends.includes(String(friend2.id))
    ) {
      return 1;
    } else {
      return 0;
    }
  };
}

function formatChatDate(date) {
  return format(date, "MMMM do, yyyy");
}

function formatMessageDate(date) {
  const currentDate = new Date();
  const messageDate = new Date(date);
  // set to the beginning of the day
  currentDate.setHours(0, 0, 0, 0);
  const isToday = currentDate < messageDate;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  const isYesterday = yesterday < messageDate;

  if (isToday) {
    // do a simple hour and minute for time
    return format(date, "hh:mm aa");
  } else if (isYesterday) {
    // check back tomorrow
    return `Yesterday ${format(date, "hh:mm aa")}`;
  } else {
    return format(date, "MMM do hh:mm aa");
  }
}

async function base64ToFile(dataUrl, filename = "upload") {
  const blob = await (await fetch(dataUrl)).blob();
  const ext = blob.type.split("/")[1] || "png";

  return new File([blob], `${filename}.${ext}`, { type: blob.type });
}

export {
  compareUsersList,
  sortPendingAcceptance,
  sortFriendsList,
  formatChatDate,
  formatMessageDate,
  base64ToFile,
};
