const emojis = {
  pass: ['✅', '☑️', '✔️', '🟢', '🎉', '👍', '🆗', '🏁'],
  fail: [
    '❌',
    '🟥',
    '🔴',
    '🚫',
    '👎',
    '💀',
    '🤦',
    '💣',
    '☠️',
    '🧨',
    '🛑',
    '🧱',
  ],
  skip: ['⏭️', '⏩', '🔜', '⏳', '💤', '🙈', '👻'],
};

function createEmojiPicker(set) {
  const lastEmojis = [];

  return () => {
    if (set.length === 1) return set[0];

    const available = set.filter((e) => !lastEmojis.includes(e));
    const pool = available.length > 0 ? available : set;
    const emoji = pool[Math.floor(Math.random() * pool.length)];

    lastEmojis.push(emoji);
    if (lastEmojis.length > 3) lastEmojis.shift();

    return emoji;
  };
}

export const getFailEmoji = createEmojiPicker(emojis.fail);
export const getPassEmoji = createEmojiPicker(emojis.pass);
export const getSkipEmoji = createEmojiPicker(emojis.skip);
