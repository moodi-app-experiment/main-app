// ── Artist roster by genre ──────────────────────────────────────────
const ARTISTS = {
  pop_punk: [
    'Blink-182', 'Fall Out Boy', 'Paramore', 'Green Day', 'Sum 41',
    'All Time Low', 'The All-American Rejects', 'New Found Glory',
    'Simple Plan', 'Good Charlotte', 'Jimmy Eat World', 'Yellowcard',
    'Relient K', 'Mayday Parade', 'The Story So Far', 'State Champs',
    'Neck Deep', 'Knuckle Puck', 'Real Friends', 'Avril Lavigne',
    'Angels & Airwaves', 'Box Car Racer', 'Senses Fail',
  ],
  emo: [
    'My Chemical Romance', 'Taking Back Sunday', 'Dashboard Confessional',
    'Brand New', 'The Used', 'Hawthorne Heights', 'Silverstein',
    'Finch', 'Thursday', 'Saves the Day', 'Straylight Run',
    'Bright Eyes', 'Something Corporate', 'From First to Last',
    'Bayside', 'Atreyu', 'Chiodos', 'Funeral for a Friend',
  ],
  metalcore: [
    'Pierce the Veil', 'Sleeping with Sirens', 'Escape the Fate',
    'Falling in Reverse', 'Black Veil Brides', 'Motionless in White',
    'Ice Nine Kills', 'Bad Omens', 'A Day to Remember', 'Bring Me the Horizon',
    'Of Mice & Men', 'Asking Alexandria', 'We Came as Romans',
    'Parkway Drive', 'Architects', 'The Devil Wears Prada',
    'Bullet For My Valentine',
  ],
  metal: [
    'Metallica', 'Slipknot', 'System of a Down', 'Pantera',
    'Rage Against the Machine', 'Linkin Park', 'Hollywood Undead',
    'Papa Roach', 'Disturbed', 'Breaking Benjamin', 'Three Days Grace',
    'Godsmack', 'Korn', 'Avenged Sevenfold', 'Trivium',
    'Killswitch Engage', 'Lamb of God',
  ],
  alt_rock: [
    'Nirvana', 'Soundgarden', 'Alice in Chains', 'Pearl Jam',
    'Audioslave', "Guns N' Roses", 'Foo Fighters', 'Weezer',
    'Third Eye Blind', 'Matchbox Twenty', 'Eve 6', 'Lit',
    'Stone Temple Pilots', 'Smashing Pumpkins', 'Bush',
    'Live', 'Collective Soul', 'Incubus',
  ],
  emo_pop: [
    'Panic! at the Disco', 'Machine Gun Kelly', 'Evanescence',
    'Hinder', 'Goo Goo Dolls', 'Secondhand Serenade',
    'Mayday Parade', 'We the Kings', 'Paramore',
    'Tonight Alive', 'The Summer Set', 'Hey Monday',
  ],
};

// ── Mood → genre groups ─────────────────────────────────────────────
const MOOD_GENRES = {
  happy_chill:         ['pop_punk', 'emo_pop'],
  happy_dance:         ['pop_punk', 'emo_pop'],
  happy_hype:          ['metal', 'metalcore', 'pop_punk'],
  sad_cry:             ['emo', 'emo_pop'],
  sad_chill:           ['emo', 'emo_pop'],
  energetic_workout:   ['metal', 'metalcore'],
  energetic_dance:     ['pop_punk', 'metalcore', 'emo_pop'],
  calm_focus:          ['alt_rock', 'emo'],
  calm_sleep:          ['emo', 'emo_pop', 'alt_rock'],
  romantic_chill:      ['emo_pop', 'emo'],
  romantic_drive:      ['emo_pop', 'emo', 'pop_punk'],
  nostalgic_throwback: ['alt_rock', 'pop_punk', 'metal'],
  anxious_chill:       ['emo', 'emo_pop', 'metalcore'],
  default:             ['pop_punk', 'emo', 'metal'],
};

// ── Lyric style → artists known for that style ─────────────────────
const LYRIC_ARTISTS = {
  emotional: [
    'Dashboard Confessional', 'Brand New', 'Bright Eyes', 'Something Corporate',
    'Straylight Run', 'Taking Back Sunday', 'The Used', 'Hawthorne Heights',
    'Saves the Day', 'Thursday', 'Silverstein', 'Finch', 'Bayside',
    'Jimmy Eat World', 'My Chemical Romance',
  ],
  anthemic: [
    'Green Day', 'Blink-182', 'Fall Out Boy', 'Paramore', 'All Time Low',
    'My Chemical Romance', 'Panic! at the Disco', 'Sum 41', 'Good Charlotte',
    'Simple Plan', 'New Found Glory', 'Yellowcard', 'The All-American Rejects',
    'Mayday Parade', 'A Day to Remember',
  ],
  dark: [
    'My Chemical Romance', 'Evanescence', 'Black Veil Brides', 'Motionless in White',
    'Bad Omens', 'Pierce the Veil', 'Bring Me the Horizon', 'Silverstein',
    'Ice Nine Kills', 'Escape the Fate', 'Falling in Reverse', 'Atreyu', 'Chiodos',
  ],
  angry: [
    'Slipknot', 'System of a Down', 'Pantera', 'Rage Against the Machine',
    'Metallica', 'Korn', 'Disturbed', 'Linkin Park', 'Papa Roach',
    'Three Days Grace', 'Godsmack', 'Killswitch Engage', 'Trivium',
    'Bullet For My Valentine', 'Avenged Sevenfold',
  ],
  hopeful: [
    'Paramore', 'All Time Low', 'New Found Glory', 'Simple Plan',
    'Mayday Parade', 'The Story So Far', 'State Champs', 'Neck Deep',
    'Knuckle Puck', 'Real Friends', 'Tonight Alive', 'We the Kings', 'Relient K',
  ],
  poetic: [
    'Brand New', 'Bright Eyes', 'Dashboard Confessional', 'Jimmy Eat World',
    'Thursday', 'Saves the Day', 'Finch', 'Bayside', 'Senses Fail',
    'Funeral for a Friend', 'Silverstein', 'Straylight Run', 'Something Corporate',
  ],
};

// ── iTunes fetch ────────────────────────────────────────────────────
async function fetchArtistSongs(artist) {
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&attribute=artistTerm&entity=song&limit=50&country=US`;
    const res = await fetch(url);
    if (!res.ok) { console.warn(`iTunes ${res.status} for ${artist}`); return []; }
    const data = await res.json();
    const needle = artist.toLowerCase();
    return (data.results || [])
      .filter(t => {
        if (!t.artistName || !t.trackName) return false;
        const a = t.artistName.toLowerCase();
        return a === needle || a.includes(needle);
      })
      .map(t => ({
        title:   t.trackName,
        artist:  t.artistName,
        artwork: t.artworkUrl100 ? t.artworkUrl100.replace('100x100bb', '300x300bb') : null,
        year:    t.releaseDate ? new Date(t.releaseDate).getFullYear() : null,
      }));
  } catch (e) {
    console.error(`fetchArtistSongs failed for ${artist}:`, e);
    return [];
  }
}

// ── Song selection ──────────────────────────────────────────────────
async function pickSongs(feeling, vibe, lyrics, preferredGenre) {
  const key = `${feeling}_${vibe}`;
  const genres = MOOD_GENRES[key] || MOOD_GENRES[`${feeling}_chill`] || MOOD_GENRES.default;
  const genrePref = (preferredGenre && preferredGenre !== 'all') ? preferredGenre : null;

  // Build artist pool: preferred genre first, then mood-relevant genres, then rest
  const artistPool = [];
  const seenArtists = new Set();
  const genreOrder = [
    ...(genrePref ? [genrePref] : []),
    ...genres.filter(g => g !== genrePref),
  ];
  for (const genre of genreOrder) {
    for (const artist of (ARTISTS[genre] || [])) {
      if (!seenArtists.has(artist)) { artistPool.push(artist); seenArtists.add(artist); }
    }
  }
  for (const genre of Object.keys(ARTISTS)) {
    for (const artist of ARTISTS[genre]) {
      if (!seenArtists.has(artist)) { artistPool.push(artist); seenArtists.add(artist); }
    }
  }

  // Sort: preferred-genre artists first, then lyric-matched, then shuffle within each tier
  const preferredGenreArtists = new Set(genrePref ? (ARTISTS[genrePref] || []) : []);
  const lyricMatch = new Set(LYRIC_ARTISTS[lyrics] || []);
  artistPool.sort((a, b) => {
    const tierA = preferredGenreArtists.has(a) ? 0 : lyricMatch.has(a) ? 1 : 2;
    const tierB = preferredGenreArtists.has(b) ? 0 : lyricMatch.has(b) ? 1 : 2;
    return tierA !== tierB ? tierA - tierB : Math.random() - 0.5;
  });

  const fetched = new Set();
  let allSongs = [];

  async function fetchBatch() {
    const batch = artistPool.filter(a => !fetched.has(a)).slice(0, 6);
    if (batch.length === 0) return;
    batch.forEach(a => fetched.add(a));
    const results = await Promise.all(batch.map(fetchArtistSongs));
    allSongs = allSongs.concat(results.flat());
  }

  const dedup = songs => songs.filter(
    (s, i, arr) => arr.findIndex(x => x.title === s.title && x.artist === s.artist) === i
  );

  // Fetch batches until we have songs from 6+ artists and 12 songs, or exhaust the pool
  await fetchBatch();
  while (fetched.size < artistPool.length) {
    const unique = dedup(allSongs);
    const artistCount = new Set(unique.map(s => s.artist)).size;
    if (unique.length >= 12 && artistCount >= 6) break;
    await fetchBatch();
  }

  // Pick 12 songs ensuring at least 6 different artists
  const pool = dedup(allSongs).sort(() => Math.random() - 0.5);
  const final = [];
  const usedArtists = new Set();

  for (const song of pool) {
    if (final.length >= 12) break;
    if (!usedArtists.has(song.artist)) {
      final.push(song);
      usedArtists.add(song.artist);
    }
  }
  for (const song of pool) {
    if (final.length >= 12) break;
    if (!final.includes(song)) final.push(song);
  }

  // Ensure at least 1 song from the 2020s
  const has2020s = final.some(s => s.year && s.year >= 2020);
  if (!has2020s) {
    let pick = dedup(allSongs).filter(s => s.year && s.year >= 2020);
    if (pick.length === 0) {
      const artists2020s = [
        'Bad Omens', 'Falling in Reverse', 'Bring Me the Horizon',
        'Machine Gun Kelly', 'Motionless in White', 'Ice Nine Kills',
        'Spiritbox', 'Sleep Token', 'Neck Deep', 'State Champs',
      ].filter(a => !fetched.has(a));
      if (artists2020s.length > 0) {
        const extra = await Promise.all(artists2020s.slice(0, 3).map(fetchArtistSongs));
        pick = extra.flat().filter(s => s.year && s.year >= 2020);
      }
    }
    if (pick.length > 0) {
      const slot = pick[Math.floor(Math.random() * pick.length)];
      if (!final.some(s => s.title === slot.title && s.artist === slot.artist)) {
        final[final.length - 1] = slot;
      }
    }
  }

  return final;
}

// ── Render results ──────────────────────────────────────────────────
function renderResults(songs, feeling, vibe, lyrics) {
  const tagsEl = document.getElementById('results-tags');
  tagsEl.innerHTML = '';
  [feeling, vibe, lyrics].filter(Boolean).forEach(v => {
    const t = document.createElement('span');
    t.className = 'results-tag';
    t.textContent = v;
    tagsEl.appendChild(t);
  });

  const grid = document.getElementById('song-grid');
  grid.innerHTML = '';
  songs.forEach((song, i) => {
    const a = document.createElement('a');
    a.href = `https://open.spotify.com/search/${encodeURIComponent(`${song.title} ${song.artist}`)}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'song-card';
    const artHtml = song.artwork
      ? `<div class="song-art"><img src="${song.artwork}" alt="${song.title}" onerror="this.parentElement.innerHTML='🎵'"></div>`
      : `<div class="song-art">🎵</div>`;
    a.innerHTML = `
      <span class="song-num">${String(i + 1).padStart(2, '0')}</span>
      ${artHtml}
      <div class="song-info">
        <div class="song-title">${song.title}</div>
        <div class="song-artist">${song.artist}</div>
      </div>
      <div class="spotify-btn">
        <svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
      </div>`;
    grid.appendChild(a);
  });
}

// ── Form logic ──────────────────────────────────────────────────────
const feelingEl = document.getElementById('feeling');
const vibeEl    = document.getElementById('vibe');
const lyricsEl  = document.getElementById('lyrics');
const genreEl   = document.getElementById('genre');
const btnCreate = document.getElementById('btn-create');

function setError(selectEl, errorEl, hasError) {
  selectEl.classList.toggle('error', hasError);
  errorEl.classList.toggle('visible', hasError);
}

function clearError(selectEl, errorId) {
  selectEl.classList.remove('error');
  document.getElementById(errorId).classList.remove('visible');
}

feelingEl.addEventListener('change', () => clearError(feelingEl, 'feeling-error'));
vibeEl.addEventListener('change',    () => clearError(vibeEl,    'vibe-error'));
lyricsEl.addEventListener('change',  () => clearError(lyricsEl,  'lyrics-error'));

btnCreate.addEventListener('click', async () => {
  const feeling = feelingEl.value;
  const vibe    = vibeEl.value;
  const lyrics  = lyricsEl.value;
  const genre   = genreEl.value;

  setError(feelingEl, document.getElementById('feeling-error'), !feeling);
  setError(vibeEl,    document.getElementById('vibe-error'),    !vibe);
  setError(lyricsEl,  document.getElementById('lyrics-error'),  !lyrics);

  if (!feeling || !vibe || !lyrics) return;

  btnCreate.disabled = true;
  btnCreate.classList.add('loading');

  const [songs] = await Promise.all([
    pickSongs(feeling, vibe, lyrics, genre),
    new Promise(resolve => setTimeout(resolve, 1000)),
  ]);
  renderResults(songs, feeling, vibe, lyrics);

  btnCreate.disabled = false;
  btnCreate.classList.remove('loading');
  document.getElementById('quiz-card').style.display = 'none';
  document.getElementById('results-card').classList.add('visible');
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('btn-back').addEventListener('click', () => {
  document.getElementById('results-card').classList.remove('visible');
  document.getElementById('quiz-card').style.display = 'flex';
  feelingEl.value = '';
  vibeEl.value = '';
  lyricsEl.value = '';
  genreEl.value = 'all';
  clearError(feelingEl, 'feeling-error');
  clearError(vibeEl,    'vibe-error');
  clearError(lyricsEl,  'lyrics-error');
});
