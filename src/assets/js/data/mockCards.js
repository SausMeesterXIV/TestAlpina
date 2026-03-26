export const mockCards = [
    {
        id: "card-1",
        animal: "AN", // Nutcracker
        landscape: "LM", // Mountain
        victoryPointCondition: {
            baseScore: 1,
            score: 1,
            selector: "LM",
            filter: "Ne" // Ne = 8 surrounding
        }
    },
    {
        id: "card-2",
        animal: "AC", // Chamois
        landscape: "LF", // Forest
        victoryPointCondition: {
            baseScore: 0,
            score: 2,
            selector: "AF", // Frog
            filter: "Or" // Or = 4 surrounding
        }
    },
    {
        id: "card-3",
        animal: "AF", // Frog
        landscape: "LL", // Lake
        victoryPointCondition: {
            baseScore: 2,
            score: 1,
            selector: "AN", // Nutcracker
            filter: "Pa" // Connected path
        }
    },
    {
        id: "card-4",
        animal: "AN",
        landscape: "LF",
        victoryPointCondition: {
            baseScore: 0,
            score: 3,
            selector: "AC",
            filter: "DE" // Right in same row
        }
    },
    {
        id: "card-5",
        animal: "AC",
        landscape: "LM",
        victoryPointCondition: {
            baseScore: 1,
            score: 2,
            selector: "Hi", // Hikers
            filter: "Ne"
        }
    },
    {
        id: "card-6",
        animal: "AF",
        landscape: "LF",
        victoryPointCondition: {
            baseScore: 0,
            score: 1,
            selector: "Ad", // Distinct animals
            filter: "Or"
        }
    },
    {
        id: "card-7",
        animal: "AN",
        landscape: "LL",
        victoryPointCondition: {
            baseScore: 0,
            score: 2,
            selector: "Ld", // Distinct landscapes
            filter: "Or"
        }
    },
    {
        id: "card-8",
        animal: "AC",
        landscape: "LM",
        victoryPointCondition: {
            baseScore: 2,
            score: 1,
            selector: "RR", // Same row
            filter: "Or" // The filter code usually isn't strict for complete row/col, but follows the API structure
        }
    }
];

export function getHand() {
    // Generate a random hand of 5 cards from the mock pool
    const hand = [];
    for(let i=0; i<5; i++) {
        const randomCard = mockCards[Math.floor(Math.random() * mockCards.length)];
        hand.push({ ...randomCard, instanceId: `hand-${Date.now()}-${i}` });
    }
    return hand;
}
