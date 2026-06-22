import {
  Building2,
  Lightbulb,
  ScreenShare,
  Trophy,
  User,
  User2,
  Divide,
  ArrowLeftRight,
  UserPlus,
  Wallet,
  Clock,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import StarBorder from "@/components/StarBorder";

// Create feature data arrays for left and right columns
const leftFeatures = [
  {
    icon: Divide,
    title: "Smart Expense Splitting",
    description:
      "Split expenses equally or unequally among friends with full flexibility.",
    position: "left",
    cornerStyle: "sm:translate-x-4 sm:rounded-br-[2px]",
    isChange: false,

  },
  {
    icon: ArrowLeftRight,
    title: "Track Who Owes Whom",
    description:
      "Automatically calculate balances so everyone knows who needs to pay and how much.",
    position: "left",
    cornerStyle: "sm:-translate-x-4 sm:rounded-br-[2px]",
    isChange: true,
  },
  {
    icon: UserPlus,
    title: "Group & Individual Expenses",
    description:
      "Manage both group trips and one-to-one expenses in a single place.",
    position: "left",
    cornerStyle: "sm:translate-x-4 sm:rounded-tr-[2px]",
    isChange: false,

  },
];
const rightFeatures = [
  {
    icon: Wallet,
    title: "Easy Settlements",
    description:
      "Mark expenses as settled and keep your records clean and organized.",
    position: "right",
    cornerStyle: "sm:-translate-x-4 sm:rounded-bl-[2px]",
    isChange: false,

  },
  {
    icon: Clock,
    title: "Clear Expense History",
    description:
      "View past expenses with full details, dates, and participants anytime.",
    position: "right",
    cornerStyle: "sm:translate-x-4 sm:rounded-bl-[2px]",
    isChange: true,

  },
  {
    icon: Sparkles,
    title: "Simple & Clean Interface",
    description:
      "A distraction-free design that makes managing money stress-free.",
    position: "right",
    cornerStyle: "sm:-translate-x-4 sm:rounded-tl-[2px]",
    isChange: false,
  },
];
// Feature card component
const FeatureCard = ({ feature }) => {
  const Icon = feature.icon;
  let text = feature.isChange ? 'text-white' : 'text-gray-900'
  console.log(feature);
  return (
    <div>
      <div
        className={cn(
          `relative rounded-2xl px-4 pt-4 pb-4 text-sm`,
          `${feature.isChange ? 'bg-indigo-500' : 'bg-secondary/50'} ring-border ring`,
          feature.cornerStyle,
        )}>
        <div className={`${text} mb-3 text-[2rem]`}>
          <Icon />
        </div>
        <h2 className={`text-foreground ${text} mb-2.5 text-2xl`}>{feature.title}</h2>
        <p className={`text-muted-foreground ${text} text-base text-pretty`}>
          {feature.description}
        </p>
        {/* Decorative elements */}
        <span className="from-primary/0 via-primary to-primary/0 absolute -bottom-px left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r opacity-60"></span>
        <span className="absolute inset-0 bg-[radial-gradient(30%_5%_at_50%_100%,hsl(var(--primary)/0.15)_0%,transparent_100%)] opacity-60"></span>
      </div>
    </div>
  );
};
export default function Feature() {
  return (
    <section className="pt-20 pb-8 bg-indigo-50" id="features">
      <div className="mx-6 max-w-[1300px] pt-2 pb-16 max-[300px]:mx-4 min-[1150px]:mx-auto">
        <div className="flex flex-wrap flex-col-reverse gap-6 md:grid md:grid-cols-3">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {leftFeatures.map((feature, index) => (
              <FeatureCard key={`left-feature-${index}`} feature={feature} />
            ))}
          </div>

          {/* Center column */}
          <div className="order-[1] mb-6 self-center sm:order-[0] md:mb-0">
            <div className="bg-secondary text-foreground ring-border relative mx-auto mb-4.5 w-fit rounded-full rounded-bl-[2px] px-4 py-2 text-sm ring">
              <span className="relative z-1 text-2xl flex items-center gap-2">
                Features
              </span>
              <span className="from-primary/0 via-primary to-primary/0 absolute -bottom-px left-1/2 h-px w-2/5 -translate-x-1/2 bg-gradient-to-r"></span>
              <span className="absolute inset-0 bg-[radial-gradient(30%_40%_at_50%_100%,hsl(var(--primary)/0.25)_0%,transparent_100%)]"></span>
            </div>

            <StarBorder
              as="button"
              thickness={2}
              className="text-foreground mb-2 font-medium text-center"
              color="red"
              speed="4s"
            >
              <h1 className="md:text-5xl text-4xl leading-[60px] sm:leading-[70px]">Key features of split buddy</h1>

            </StarBorder>

            <h2 className="text-foreground mb-2 font-medium text-center text-2xl sm:mb-2.5 md:text-[3rem]">
            </h2>
            <p className="text-muted-foreground mx-auto max-w-[18rem] text-center text-pretty">
              Cohorts are best way to learn because you finish the course in a
              timely manner
            </p>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {rightFeatures.map((feature, index) => (
              <FeatureCard key={`right-feature-${index}`} feature={feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}