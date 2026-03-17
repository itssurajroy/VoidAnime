const ANIME_QUOTES = [
  { anime: 'Naruto', character: 'Naruto Uzumaki', quote: 'I never go back on my words. That\'s my nindo, my ninja way!' },
  { anime: 'Naruto', character: 'Itachi Uchiha', quote: 'Those who forgive themselves, and are able to accept their truth... they will be able to achieve true strength.' },
  { anime: 'Fullmetal Alchemist', character: 'Edward Elric', quote: 'A lesson without pain is meaningless. That is because no one can gain without sacrificing something.' },
  { anime: 'Fullmetal Alchemist', character: 'Roy Mustang', quote: 'If you too must walk the path of bloodshed, then walk it alone. Do not inflict the same pain you felt onto others.' },
  { anime: 'Attack on Titan', character: 'Levi Ackerman', quote: 'The only ones who should kill are those who are prepared to be killed.' },
  { anime: 'Attack on Titan', character: 'Eren Yeager', quote: 'If you win, you live. If you lose, you die. If you don\'t fight, you can\'t win!' },
  { anime: 'Death Note', character: 'Light Yagami', quote: 'I\'ve decided to become the god of this new world.' },
  { anime: 'Death Note', character: 'L Lawliet', quote: 'I\'ll take a bet. I\'m 100% sure that Kira is human.' },
  { anime: 'One Piece', character: 'Monkey D. Luffy', quote: 'I\'m not a hero! I don\'t want to save anyone! I just want to defeat you!' },
  { anime: 'One Piece', character: 'Roronoa Zoro', quote: 'I don\'t want to conquer anything. I just think the guy with the most freedom is the king.' },
  { anime: 'Hunter x Hunter', character: 'Gon Freecss', quote: 'You should enjoy the little detours, because that\'s where you\'ll find the things more important than what you want.' },
  { anime: 'Hunter x Hunter', character: 'Killua Zoldyck', quote: 'You don\'t have to be scared of losing anything anymore. Because in this world... there\'s no such thing as fate.' },
  { anime: 'JoJo\'s Bizarre Adventure', character: 'Dio Brando', quote: 'The truly strong person is not the one who wins, but the one who can stand to lose.' },
  { anime: 'Code Geass', character: 'Lelouch Lamperouge', quote: 'The world is cruel, and yet also beautiful.' },
  { anime: 'Code Geass', character: 'C.C.', quote: 'There are no such things as heroes or villains. People are just people.' },
  { anime: 'Steins;Gate', character: 'Rintaro Okabe', quote: 'El Psy Kongroo.' },
  { anime: 'Steins;Gate', character: 'Kurisu Makise', quote: 'If you want to see the value of life, try looking at it from a different perspective.' },
  { anime: 'My Hero Academia', character: 'All Might', quote: 'You can become a hero!' },
  { anime: 'My Hero Academia', character: 'Katsuki Bakugo', quote: 'I AM THE PLUS ULTRA!' },
  { anime: 'Demon Slayer', character: 'Tanjiro Kamado', quote: 'Even if I can\'t win, I have to try. My resolve is my strength.' },
  { anime: 'Demon Slayer', character: 'Zenitsu Agatsuma', quote: 'I\'m not the type to be saved. I\'m the type to die fighting!' },
  { anime: 'Jujutsu Kaisen', character: 'Gojo Satoru', quote: 'I\'m the strongest.' },
  { anime: 'Jujutsu Kaisen', character: 'Megumi Fushiguro', quote: 'I want to get stronger. Not to beat anyone, but to protect those I need to protect.' },
  { anime: 'Chainsaw Man', character: 'Denji', quote: 'I\'m not doing this for some ideology. I just want to touch a boob!' },
  { anime: 'Chainsaw Man', character: 'Power', quote: 'I don\'t know about God, but I\'m definitely your friend.' },
  { anime: 'Mob Psycho 100', character: 'Mob', quote: 'I will continue to strive to become a better person.' },
  { anime: 'Mob Psycho 100', character: 'Reigen Arataka', quote: 'The key to solving any problem is to understand the problem itself.' },
  { anime: 'Tokyo Ghoul', character: 'Ken Kaneki', quote: 'We are all alone. But that\'s not true. We are all alone because we don\'t understand each other.' },
  { anime: 'Spirited Away', character: 'Chihiro', quote: 'Once you do something, you never forget. Even if you don\'t remember.' },
  { anime: 'Spirited Away', character: 'No-Face', quote: 'Don\'t look back. Just move forward.' },
  { anime: 'Your Name', character: 'Mitsuha Miyamizu', quote: 'Maybe there is an invisible line that connects us somewhere.' },
  { anime: 'A Silent Voice', character: 'Shoya Ishida', quote: 'It\'s not about seeing the defects in yourself, but about knowing your limits.' },
  { anime: 'Violet Evergarden', character: 'Violet Evergarden', quote: 'I want to know what words would make you happy.' },
  { anime: 'Re:Zero', character: 'Subaru Natsuki', quote: 'I will conquer my fate with my own hands!' },
  { anime: 'Re:Zero', character: 'Rem', quote: 'If you feel love, even if it\'s not returned, you\'re still the richest person in the world.' },
  { anime: 'Sword Art Online', character: 'Kirito', quote: 'I\'m a solo player. I don\'t need party members.' },
  { anime: 'Fairy Tail', character: 'Natsu Dragneel', quote: 'I\'m not afraid of dying. I\'m not afraid of anything!' },
  { anime: 'Fairy Tail', character: 'Gray Fullbuster', quote: 'I\'m not the type to just give up. I have to do whatever it takes!' },
  { anime: 'Bleach', character: 'Ichigo Kurosaki', quote: 'I protect what I must. I fight for what I believe in.' },
  { anime: 'Dragon Ball Z', character: 'Goku', quote: 'I am the Saiyan who came from Earth.' },
  { anime: 'Dragon Ball Z', character: 'Vegeta', quote: 'I am the Prince of all Saiyans!' },
  { anime: 'Cowboy Bebop', character: 'Spike Spiegel', quote: 'I\'m not going to die here. I\'ve still got things to do.' },
  { anime: 'Neon Genesis Evangelion', character: 'Shinji Ikari', quote: 'I mustn\'t run away.' },
  { anime: 'Haikyuu', character: 'Shouyou Hinata', quote: 'I don\'t want to be a bird that can fly. I want to be a bird that can fly. But I can\'t fly. So I want to build wings to fly.' },
  { anime: 'Haikyuu', character: 'Tobio Kageyama', quote: 'I don\'t care about the team. I just want to win.' },
  { anime: 'Black Clover', character: 'Asta', quote: 'I don\'t care if I can\'t use magic! I\'ll become the Wizard King with my sword!' },
  { anime: 'Assassination Classroom', character: 'Koro-sensei', quote: 'The world isn\'t always fair. That\'s why you have to work hard to make it better.' },
];

export function getRandomQuote(): { anime: string; character: string; quote: string } {
  const index = Math.floor(Math.random() * ANIME_QUOTES.length);
  return ANIME_QUOTES[index];
}

export function getQuotesByAnime(anime: string): { anime: string; character: string; quote: string }[] {
  return ANIME_QUOTES.filter(q => q.anime.toLowerCase() === anime.toLowerCase());
}

export function getQuotesByCharacter(character: string): { anime: string; character: string; quote: string }[] {
  return ANIME_QUOTES.filter(q => q.character.toLowerCase().includes(character.toLowerCase()));
}
