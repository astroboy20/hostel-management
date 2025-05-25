import { Hostel } from "../models/models";

// a custom type for seeding data that matches the shape of your objects
type HostelSeed = {
    id: number;
    name: string;
    type: string;
    price: number;
    capacity: string;
    available: number;
    total: number;
    image: string;
    features: string[];
    description: string;
};

export const seedHotels = async () => {
    const hostelData: HostelSeed[] = [
        {
            id: 1,
            name: "Block A",
            type: "Standard",
            price: 50000,
            capacity: "4 per room",
            available: 25,
            total: 100,
            image:
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            features: ["Wi-Fi", "Shared Bathroom", "Common Room", "Study Area"],
            description:
                "Standard accommodation with basic amenities for students. Comfortable living space with shared facilities.",
        },
        {
            id: 2,
            name: "Block B",
            type: "Premium",
            price: 75000,
            capacity: "2 per room",
            available: 15,
            total: 50,
            image:
                "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            features: [
                "Wi-Fi",
                "Attached Bathroom",
                "Common Room",
                "Study Area",
                "Cafeteria",
            ],
            description:
                "Premium accommodation with enhanced amenities for students who prefer more comfort and privacy.",
        },
        {
            id: 3,
            name: "Block C",
            type: "Deluxe",
            price: 100000,
            capacity: "1 per room",
            available: 5,
            total: 30,
            image:
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            features: [
                "Wi-Fi",
                "Private Bathroom",
                "Common Room",
                "Study Area",
                "Cafeteria",
                "Air Conditioning",
            ],
            description:
                "Deluxe single-occupancy rooms with premium amenities for students who value privacy and comfort.",
        },
        {
            id: 4,
            name: "Block D",
            type: "Standard",
            price: 55000,
            capacity: "4 per room",
            available: 20,
            total: 80,
            image:
                "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            features: ["Wi-Fi", "Shared Bathroom", "Common Room", "Study Area"],
            description:
                "Newly constructed standard accommodation with modern facilities and comfortable living spaces.",
        },
        {
            id: 5,
            name: "Block E",
            type: "Premium",
            price: 80000,
            capacity: "2 per room",
            available: 10,
            total: 40,
            image:
                "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            features: [
                "Wi-Fi",
                "Attached Bathroom",
                "Common Room",
                "Study Area",
                "Cafeteria",
            ],
            description:
                "Modern premium accommodation with enhanced amenities and comfortable living environment.",
        },
        {
            id: 6,
            name: "Block F",
            type: "Deluxe",
            price: 110000,
            capacity: "1 per room",
            available: 3,
            total: 20,
            image:
                "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            features: [
                "Wi-Fi",
                "Private Bathroom",
                "Common Room",
                "Study Area",
                "Cafeteria",
                "Air Conditioning",
            ],
            description:
                "Exclusive deluxe accommodation with premium amenities and maximum privacy for students.",
        },
    ];

    try {
        const existingHotels = await Hostel.countDocuments()
        if (existingHotels > 0) {
            console.log("Hotels already seeded, skipping...")
            return
        }

        const createdHostels = await Hostel.insertMany(hostelData)
        console.log(`${createdHostels.length} hostels seeded successfully`);

        return createdHostels
    } catch (error) {
        console.error('Error seeding hostels:', error);
        throw error;
    }
}