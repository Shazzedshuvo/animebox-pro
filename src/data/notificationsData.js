// src/data/notificationsData.js - Live simulated anime broadcast alerts

export const initialNotifications = [
  {
    id: "notif-1",
    animeId: 1,
    title: "Solo Leveling Season 2 Broadcast",
    banglaTitle: "সোলো লেভেলিং সিজন ২ সম্প্রচার",
    message: "Solo Leveling Episode 8 is now available in 4K UHD with English & Hindi Dub.",
    banglaMessage: "সোলো লেভেলিং এপিসোড ৮ এখন ৪কে ইউএইচডি এবং হিন্দি ডাবসহ উপলব্ধ।",
    time: "5m ago",
    banglaTime: "৫ মিনিট আগে",
    image: "https://images.weserv.nl/?url=https://cdn.myanimelist.net/images/anime/1170/124305l.jpg&w=200&h=200&fit=cover",
    read: false,
    type: "new_episode"
  },
  {
    id: "notif-2",
    animeId: 2,
    title: "Demon Slayer Hindi Dub Added",
    banglaTitle: "ডিমন স্লেয়ার হিন্দি ডাব যুক্ত হয়েছে",
    message: "Hashira Training Arc full season Hindi Dub has been released on Server 2.",
    banglaMessage: "হাশির প্রশিক্ষণ আর্ক সম্পূর্ণ সিজন হিন্দি ডাব সার্ভার ২-এ যুক্ত হয়েছে।",
    time: "20m ago",
    banglaTime: "২০ মিনিট আগে",
    image: "https://images.weserv.nl/?url=https://cdn.myanimelist.net/images/anime/1286/99889l.jpg&w=200&h=200&fit=cover",
    read: false,
    type: "dub"
  },
  {
    id: "notif-3",
    animeId: 7,
    title: "Frieren: Beyond Journey's End",
    banglaTitle: "ফ্রিরেন: বিয়ন্ড জার্নিস এন্ড",
    message: "Special Director's Cut episode now streaming with English Subtitles.",
    banglaMessage: "স্পেশাল ডিরেক্টরস কাট এপিসোড এখন সাবটাইটেলসহ স্ট্রিমিং হচ্ছে।",
    time: "2h ago",
    banglaTime: "২ ঘণ্টা আগে",
    image: "https://images.weserv.nl/?url=https://cdn.myanimelist.net/images/anime/1015/138025l.jpg&w=200&h=200&fit=cover",
    read: true,
    type: "movie"
  },
  {
    id: "notif-4",
    animeId: 4,
    title: "Attack on Titan Final Part Movie",
    banglaTitle: "অ্যাটাক অন টাইটান ফাইনাল মুভি",
    message: "The Rumbling: Complete cinematic edition added to Anime Movies collection.",
    banglaMessage: "দ্য রামব্লিং: সম্পূর্ণ সিনেমাটিক সংস্করণ মুভি কালেকশনে যুক্ত হয়েছে।",
    time: "1d ago",
    banglaTime: "১ দিন আগে",
    image: "https://images.weserv.nl/?url=https://cdn.myanimelist.net/images/anime/10/47347l.jpg&w=200&h=200&fit=cover",
    read: true,
    type: "premiere"
  }
];
