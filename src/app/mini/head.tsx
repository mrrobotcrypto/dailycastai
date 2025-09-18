export default function Head() {
  const embed = {
    version: "1",
    imageUrl: "https://placehold.co/1200x800/png?text=DailyCast+AI", // 3:2 oran, <10MB
    button: {
      title: "DailyCast AI",
      action: {
        type: "launch_miniapp",
        name: "DailyCast AI",
        url: process.env.NEXT_PUBLIC_APP_URL
          ? `${process.env.NEXT_PUBLIC_APP_URL}/mini`
          : "http://localhost:3000/mini",
        splashImageUrl: "https://placehold.co/200x200/png",
        splashBackgroundColor: "#0b0b0f",
      },
    },
  };

  return (
    <>
      <meta name="fc:miniapp" content={JSON.stringify(embed)} />
      {/* Eski istemciler için back-compat */}
      <meta
        name="fc:frame"
        content={JSON.stringify({
          ...embed,
          button: { ...embed.button, action: { ...embed.button.action, type: "launch_frame" } },
        })}
      />
      <title>DailyCast AI</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
}
