from bson import ObjectId
from typing import List, Optional
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.models.project import Project

class ProjectRepository:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.collection = db["projects"]
        self.db = db

    async def seed_if_empty(self):
        count = await self.collection.count_documents({})
        if count > 0:
            return

        seeds = [
            {
                "title": "Analytics Dashboard",
                "subtitle": "PROJECT DETAILS",
                "description": "A responsive analytics dashboard with real-time data visualization and reporting.",
                "long_desc": "This Analytics Dashboard provides businesses with a powerful way to visualize their data. It features real-time charts, user activity tracking, and customizable reporting tools, all wrapped in a sleek, dark-themed interface. By leveraging modern visualization libraries and real-time data streaming, it empowers stakeholders to make data-driven decisions with confidence and speed.",
                "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
                "images": [
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1504868584819-f8e90526354a?q=80&w=2000&auto=format&fit=crop"
                ],
                "category": "Web Apps",
                "role": "Full Stack Developer",
                "duration": "4 Weeks",
                "completed": "March 2024",
                "tools": "VS Code, Figma, Postman",
                "methodology": "Scrum",
                "features": [
                    {"title": "Real-time Data", "desc": "Live updates using WebSocket technology.", "icon": "Zap"},
                    {"title": "Custom Charts", "desc": "Interactive visualizations with Recharts.", "icon": "BarChart3"},
                    {"title": "User Management", "desc": "Complete RBAC (Role-Based Access Control).", "icon": "Users"},
                    {"title": "Performance Monitoring", "desc": "Track server-side performance metrics.", "icon": "Rocket"},
                    {"title": "Responsive Layout", "desc": "Optimized for desktop and tablet views.", "icon": "Layout"},
                    {"title": "Export Reports", "desc": "Download data in CSV and PDF formats.", "icon": "ExternalLink"}
                ],
                "tech_stack": [
                    {"name": "React.js", "icon": "fab fa-react"},
                    {"name": "Node.js", "icon": "fab fa-node-js"},
                    {"name": "MongoDB", "icon": "fas fa-database"},
                    {"name": "Express.js", "icon": "fas fa-server"},
                    {"name": "TypeScript", "icon": "fas fa-code"},
                    {"name": "Tailwind CSS", "icon": "fab fa-css3-alt"}
                ],
                "learned": "Working on this dashboard taught me a lot about data handling and state management in complex React applications. I learned how to optimize rendering for large datasets and implement real-time features efficiently.",
                "featured": True,
                "live_url": "#",
                "github_url": "#"
            },
            {
                "title": "Travel Website",
                "subtitle": "PROJECT DETAILS",
                "description": "A modern travel website UI with beautiful destinations and booking functionality.",
                "long_desc": "This Travel Website was designed to provide users with an immersive booking experience. It features stunning destination galleries, a seamless booking flow, and integrated maps for trip planning. The platform prioritizes high-performance visuals and lightning-fast search capabilities to ensure travelers can find and book their dream vacations with ease and transparency.",
                "image": "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop",
                "images": [
                    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2000&auto=format&fit=crop"
                ],
                "category": "Web Apps",
                "role": "Frontend Developer",
                "duration": "3 Weeks",
                "completed": "April 2024",
                "tools": "Figma, VS Code, Git",
                "methodology": "Agile",
                "features": [
                    {"title": "Destination Search", "desc": "Advanced filtering for finding the perfect trip.", "icon": "Tag"},
                    {"title": "Interactive Maps", "desc": "Integrated Google Maps for location tracking.", "icon": "Smartphone"},
                    {"title": "Booking System", "desc": "Smooth multi-step booking and payment process.", "icon": "Settings"},
                    {"title": "User Reviews", "desc": "Community-driven feedback and ratings.", "icon": "Users"},
                    {"title": "Mobile Optimized", "desc": "First-class experience on mobile devices.", "icon": "Layout"},
                    {"title": "Secure Checkout", "desc": "Stripe integration for safe transactions.", "icon": "CheckCircle2"}
                ],
                "tech_stack": [
                    {"name": "Next.js", "icon": "fab fa-react"},
                    {"name": "Tailwind CSS", "icon": "fab fa-css3-alt"},
                    {"name": "Framer Motion", "icon": "fas fa-magic"},
                    {"name": "Clerk Auth", "icon": "fas fa-user-shield"},
                    {"name": "Prisma", "icon": "fas fa-database"},
                    {"name": "PostgreSQL", "icon": "fas fa-server"}
                ],
                "learned": "I focused heavily on user experience and animations in this project. Using Framer Motion helped me create smooth transitions that make the app feel premium. I also improved my skills in handling complex forms and state in Next.js.",
                "featured": False,
                "live_url": "#",
                "github_url": "#"
            },
            {
                "title": "Task Manager App",
                "subtitle": "PROJECT DETAILS",
                "description": "A mobile task management app to boost productivity and organize daily tasks.",
                "long_desc": "Task Manager is a productivity-focused app designed for individuals and small teams. It simplifies task tracking with a clean UI, priority levels, and smart notifications to ensure nothing falls through the cracks. Built with a focus on minimalism and efficiency, it provides a distraction-free environment for managing complex workflows and daily agendas.",
                "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop",
                "images": [
                    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?q=80&w=2000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2000&auto=format&fit=crop"
                ],
                "category": "Others",
                "role": "UI/UX Designer & Dev",
                "duration": "2 Weeks",
                "completed": "February 2024",
                "tools": "Figma, Flutter, Firebase",
                "methodology": "Personal Project",
                "features": [
                    {"title": "Smart Notifications", "desc": "Timely reminders for upcoming deadlines.", "icon": "Zap"},
                    {"title": "Priority Levels", "desc": "Color-coded tasks based on importance.", "icon": "Tag"},
                    {"title": "Cloud Sync", "desc": "Instant sync across all your devices.", "icon": "Rocket"},
                    {"title": "Dark Mode", "desc": "Eye-friendly interface for late-night work.", "icon": "Sparkles"},
                    {"title": "Offline Access", "desc": "Work on your tasks even without internet.", "icon": "CheckCircle2"},
                    {"title": "Team Sharing", "desc": "Share lists and tasks with friends.", "icon": "Users"}
                ],
                "tech_stack": [
                    {"name": "Flutter", "icon": "fas fa-mobile-screen-button"},
                    {"name": "Dart", "icon": "fas fa-code"},
                    {"name": "Firebase", "icon": "fas fa-fire"},
                    {"name": "Provider", "icon": "fas fa-box"},
                    {"name": "Hive", "icon": "fas fa-database"},
                    {"name": "Git", "icon": "fab fa-git-alt"}
                ],
                "learned": "This project allowed me to explore Flutter and cross-platform development. I learned how to manage local storage for offline support and integrate Firebase for real-time data synchronization. Designing the UI was also a great exercise in mobile ergonomics.",
                "featured": False,
                "live_url": "#",
                "github_url": "#"
            },
            {
                "title": "Eco-Friendly E-commerce",
                "subtitle": "PROJECT DETAILS",
                "description": "Sustainable shopping platform with focus on clean UI and smooth user experience.",
                "long_desc": "This Eco-Friendly E-commerce platform was built to promote sustainable products. It features a minimalist design, carbon footprint tracking for shipments, and a highly optimized product discovery experience. By integrating ethical shopping practices with modern technology, it creates a unique marketplace where conscious consumers can shop with peace of mind.",
                "image": "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2070&auto=format&fit=crop",
                "images": [
                    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=2000&auto=format&fit=crop"
                ],
                "category": "E-Commerce",
                "role": "Full Stack Developer",
                "duration": "5 Weeks",
                "completed": "May 2024",
                "tools": "Figma, VS Code, Strapi",
                "methodology": "Agile",
                "features": [
                    {"title": "Carbon Tracking", "desc": "Estimate the footprint of your purchases.", "icon": "BarChart3"},
                    {"title": "Sustainable Filters", "desc": "Filter products by eco-friendly criteria.", "icon": "Tag"},
                    {"title": "One-Click Checkout", "desc": "Optimized sales funnel for high conversion.", "icon": "Rocket"},
                    {"title": "Product Story", "desc": "Detailed info about the origin of items.", "icon": "BookOpen"},
                    {"title": "Loyalty Program", "desc": "Rewards for sustainable shopping habits.", "icon": "Users"},
                    {"title": "Advanced Search", "desc": "Fast and relevant product discovery.", "icon": "Zap"}
                ],
                "tech_stack": [
                    {"name": "React.js", "icon": "fab fa-react"},
                    {"name": "Strapi", "icon": "fas fa-leaf"},
                    {"name": "Tailwind CSS", "icon": "fab fa-css3-alt"},
                    {"name": "Stripe", "icon": "fab fa-stripe"},
                    {"name": "Redux Toolkit", "icon": "fas fa-layer-group"},
                    {"name": "Cloudinary", "icon": "fas fa-image"}
                ],
                "learned": "Building this platform taught me the importance of performance in e-commerce. I learned how to implement server-side rendering for better SEO and use Redux for managing complex shopping cart states. I also gained experience in integrating headless CMS like Strapi.",
                "featured": True,
                "live_url": "#",
                "github_url": "#"
            }
        ]

        for s in seeds:
            s["created_at"] = datetime.utcnow()
            await self.collection.insert_one(s)

    async def create(self, project: Project) -> Project:
        doc = project.to_mongo()
        result = await self.collection.insert_one(doc)
        project.id = str(result.inserted_id)
        return project

    async def get_all(self) -> List[Project]:
        await self.seed_if_empty()
        records = []
        cursor = self.collection.find().sort("created_at", 1)
        async for doc in cursor:
            records.append(Project.from_mongo(doc))
        return records

    async def get_by_id(self, id: str) -> Optional[Project]:
        if not ObjectId.is_valid(id):
            return None
        doc = await self.collection.find_one({"_id": ObjectId(id)})
        return Project.from_mongo(doc)

    async def update(self, id: str, updated_data: dict) -> Optional[Project]:
        if not ObjectId.is_valid(id):
            return None
        updated_data.pop("_id", None)
        result = await self.collection.update_one(
            {"_id": ObjectId(id)},
            {"$set": updated_data}
        )
        if result.matched_count > 0:
            return await self.get_by_id(id)
        return None

    async def delete(self, id: str) -> bool:
        if not ObjectId.is_valid(id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
