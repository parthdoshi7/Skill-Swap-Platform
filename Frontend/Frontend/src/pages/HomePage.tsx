import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRightIcon, UsersIcon, StarIcon, ActivityIcon, Star, MailCheck, User, CalendarClock, Search, Repeat } from 'lucide-react';
import ReviewSection from './Review';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
        icon: <Repeat className="w-8 h-8" style={{ color: "#84CC16" }} />,
        title: "Skill-for-Skill Exchange",
        desc: "Swap your talents with others — no money involved, just mutual learning. Everyone has something to teach and something to learn. Connect with people who complement your abilities and grow together."
    },
    {
        icon: <Search className="w-8 h-8" style={{ color: "#0EA5E9" }} />,
        title: "Discover Skills Easily",
        desc: 'Use our smart skill search to find users by skill keywords like "Photoshop", "Cooking", or "Excel". Each profile highlights what a user offers and what they’re looking to learn — making it easy to match up.'
    },
    {
        icon: <CalendarClock className="w-8 h-8" style={{ color: "#4F46E5" }} />,
        title: "Flexible Scheduling",
        desc: "Life is busy — that's why you can set your preferred availability like weekends, weekdays, or evenings. Swap on your terms, when you’re free, without stress or pressure."
    },
    {
        icon: <User className="w-8 h-8" style={{ color: "#0EA5E9" }} />,
        title: "Personalized Profiles",
        desc: "Create a simple, clean profile with your name, location (optional), skills offered and wanted, and even a profile picture. Choose to make it public or private — your privacy, your choice."
    },
    {
        icon: <MailCheck className="w-8 h-8" style={{ color: "#4F46E5" }} />,
        title: "Simple Swap Requests",
        desc: "Send a request, accept one, or delete it if things change — everything is transparent. All your current and pending swaps are tracked neatly, making the whole experience smooth and manageable."
    },
    {
        icon: <Star className="w-8 h-8" style={{ color: "#84CC16" }} />,
        title: "Ratings & Feedback",
        desc: "After each swap, leave a quick rating or review to help others build credibility. Feedback encourages quality, builds trust, and makes the entire community more valuable for everyone."
    },
];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white py-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                Share Your Skills.<br />Learn New Ones.
              </h1>
              <p className="text-xl text-gray-600">
                SkillSwap connects people who want to exchange skills and knowledge in a collaborative community.
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/browse">
                      <Button size="lg" className="gap-2">
                        Browse Skills <ArrowRightIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/profile">
                      <Button size="lg" variant="outline">
                        Manage Your Profile
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="gap-2">
                        Get Started <ArrowRightIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden lg:block"
            >
              <img 
                src="https://res.cloudinary.com/dzsvjyg2c/image/upload/Z_sawpsf.png"
                alt="People collaborating" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              SkillSwap makes it easy to connect with others and exchange knowledge
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

            <ReviewSection/>
      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-violet-600 text-white">
        <div className="container max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h2 className="text-3xl font-bold">Ready to start exchanging skills?</h2>
            <p className="text-lg text-blue-100">
              Join our community today and start sharing your knowledge while learning from others.
            </p>
            <div className="pt-4">
              {isAuthenticated ? (
                <Link to="/browse">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Browse Skills Now <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="gap-2">
                    Join SkillSwap <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}