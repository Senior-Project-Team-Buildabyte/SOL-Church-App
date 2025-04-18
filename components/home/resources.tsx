import DynamicButton from '../universal/dynamic-button';

const Resources = () => {

  return (
    <DynamicButton buttons={[
      {
        type: 0, // external
        shape: 0, // full
        buttonConfig: {
            text: "CONNECT CARD",
            icon: "angle-double-right",
            link: "https://solsacramento.churchcenter.com/people/forms/718725",
            backgroundGradient: ["0", "rgba(0, 0, 0, 0.9)", "rgba(60,129,246,1)"]
          }
      },
      {
        type: 0, // internal
        shape: 1, // square
        buttonConfig: {
            text: "SOL Bible Academy",
            link: "https://solsacramento.com/sba",
            backgroundImage: require('@/assets/images/bg-sba.jpg'),
        }
      },
      {
        type: 0, // external
        shape: 1, // square
        buttonConfig: {
            text: "ABOUT SOL",
            link: "https://www.solsacramento.com/about?embedded=true",
            backgroundImage: require('@/assets/images/bg-about-sol.jpg'),
        }
      },
      {
        type: 1, // internal
        shape: 1, // square
        buttonConfig: {
            text: "SOL MISSION",
            icon: 'signing',
            internalLink: `./solMission`,
            backgroundImage: require('@/assets/images/bg-mission.jpg'),
        }
      },
      {
        type: 1, // internal
        shape: 1, // square
        buttonConfig: {
            text: "SOLru",
            internalLink: `./solRu`,
            backgroundImage: require('@/assets/images/bg-sol-ru.jpg'),
        }
      },
      {
        type: 2, // internal - forms/calendar
        shape: 1, // square
        buttonConfig: {
            text: "Calendar",
            icon: "calendar",
            internalLink: `../(tabs)/home/calendar`,
            backgroundColor: "rgba(255,255,255,1)",
         }
      },
      {
        type: 2, // internal - forms/calendar
        shape: 1, // square
        buttonConfig: {
            text: "Forms",
            icon: "edit",
            internalLink: `../(tabs)/home/forms`,
            backgroundColor: "rgba(255,255,255,1)",
        }
      }
    ]}/>
  );
};

export default Resources;