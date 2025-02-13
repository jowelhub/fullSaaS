import { Code, Zap, Shield, BarChart } from "lucide-react"

const features = [
  {
    icon: Code,
    title: "Modern Stack",
    description: "Built with the latest technologies for optimal performance and developer experience.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with instant page transitions and minimal loading times.",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Enterprise-grade security measures to protect your data and users.",
  },
  {
    icon: BarChart,
    title: "Analytics",
    description: "Comprehensive insights into your application's performance and user behavior.",
  },
]

export default function Features() {
  return (
    <section id="features" className="w-full py-20 md:py-32">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <div className="text-[#10B981] font-medium mb-2">FEATURES</div>
          <h2 className="text-3xl font-bold sm:text-5xl mb-4">Everything you need</h2>
          <p className="max-w-[800px] text-gray-600 md:text-lg mb-12">
            Powerful tools to help you build, launch, and scale your SaaS project.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start">
              <div className="rounded-lg bg-[#DCFCE7] p-3 mb-4">
                <feature.icon className="h-6 w-6 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
