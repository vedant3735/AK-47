// Love Coupons
export const loveCoupons = [
  {
    title: "Foot Massage",
    description: "Redeem for one relaxing foot massage",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    title: "Guilt-free Shopping Spree",
    description: "Redeem for one shopping trip with no budget complaints",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    title: "Skip an Argument",
    description: "Use this card to instantly win any argument",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    title: "Breakfast in Bed",
    description: "Redeem for a delicious breakfast served in bed",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    title: "Movie Night",
    description: "Your choice of movie with no complaints",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    title: "Date Night",
    description: "Redeem for a special date night planned by your partner",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    title: "Chore Pass",
    description: "Skip one household chore of your choice",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
  {
    title: "Cuddle Session",
    description: "Redeem for an uninterrupted cuddle session",
    imageUrl: "/placeholder.svg?height=100&width=100",
  },
]

// Apology templates
export const apologyTemplates = {
  poetic: [
    "In the garden of our love, I planted a seed of hurt; now I water it with tears of regret, hoping for forgiveness to bloom.",
    "Like the moon that wanes but always returns full, my heart seeks to shine complete again in your sky.",
    "Words spoken in haste, like autumn leaves, have fallen between us. Let me gather them with gentle hands and make room for new growth.",
  ],
  dramatic: [
    "The weight of my mistake crushes my soul! I stand before you, broken and desperate for your forgiveness!",
    "How could I have been so blind? The pain in your eyes is a dagger to my heart! Please, give me one more chance!",
    "I've committed the gravest of errors, and now I'm drowning in the sea of my regret! Only your forgiveness can save me!",
  ],
  shakespearean: [
    "Shall I compare thee to a summer's day? Nay, for I have cast clouds upon thy sunshine with my thoughtless deeds. Pray, grant me pardon.",
    "What fool am I, who with my clumsy words hath wounded thee? My heart doth break to see thy sorrow, caused by mine own folly.",
    "O, what a rogue and peasant slave am I! To have offended thee, the fairest creature in all the land. I beg thy mercy.",
  ],
}

// Date ideas
export const dateIdeas = [
  "Picnic in the park with your favorite foods",
  "Stargazing night with blankets and hot chocolate",
  "Cooking a new recipe together",
  "Spa night with face masks and massages",
  "Game night with your favorite board games",
  "Movie marathon with your favorite films",
  "Visit to a local museum or art gallery",
  "Hiking trip to a scenic location",
  "Dance lesson for a style you've never tried",
  "Wine tasting at a local vineyard",
]

// Resolution wheel options
export const resolutionOptions = [
  "Cook dinner tonight",
  "Write a poem",
  "Movie night (their pick)",
  "Breakfast in bed",
  "30-minute massage",
  "Do their chores for a day",
  "Plan a surprise date",
  "No phone for an evening",
  "Bake something sweet",
  "Create a playlist",
  "Take a walk together",
  "Give a sincere compliment",
]

// Get a random item from an array
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// Generate a random apology based on style
export function generateApology(style: "poetic" | "dramatic" | "shakespearean", issue: string): string {
  const template = getRandomItem(apologyTemplates[style])
  return `${template}\n\nI'm truly sorry about ${issue.toLowerCase()}.`
}

// Mood-based theme colors
export const moodThemes = {
  angry: {
    primary: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-200",
    button: "bg-blue-500 hover:bg-blue-600",
    message: "Take a deep breath. Everything will be okay.",
    meme: "/placeholder.svg?height=200&width=300&text=Calming+Meme",
  },
  sad: {
    primary: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-200",
    button: "bg-purple-500 hover:bg-purple-600",
    message: "You're amazing and deserve all the happiness!",
    meme: "/placeholder.svg?height=200&width=300&text=Cheerful+Meme",
  },
  neutral: {
    primary: "bg-pink-50",
    text: "text-pink-800",
    border: "border-pink-200",
    button: "bg-pink-500 hover:bg-pink-600",
    message: "Hope you're having a good day!",
    meme: "/placeholder.svg?height=200&width=300&text=Funny+Meme",
  },
  happy: {
    primary: "bg-green-50",
    text: "text-green-800",
    border: "border-green-200",
    button: "bg-green-500 hover:bg-green-600",
    message: "Your smile brightens everyone's day!",
    meme: "/placeholder.svg?height=200&width=300&text=Happy+Meme",
  },
  loving: {
    primary: "bg-red-50",
    text: "text-red-800",
    border: "border-red-200",
    button: "bg-red-500 hover:bg-red-600",
    message: "You're the best thing that ever happened to me!",
    meme: "/placeholder.svg?height=200&width=300&text=Love+Meme",
  },
}

// Get theme based on mood
export function getThemeByMood(mood: string) {
  return moodThemes[mood as keyof typeof moodThemes] || moodThemes.neutral
}
