import Head from "next/head";

export default function CustomHead() {
  return (
    <Head>
      <title>Feedni, The open-source content-aggregator.</title>
      <meta
        name="description"
        content="Use Feedni to follow your favorite blogs, magazines and news
      outlets"
      />

      <meta property="og:url" content="http://feedni.hasan.one/" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Feedni, The open-source content-aggregator."
      />
      <meta
        property="og:description"
        content="Use Feedni to follow your favorite blogs, magazines and news
      outlets"
      />
      <meta
        property="og:image"
        content="https://github.com/Hasan-aga/feedni/blob/master/public/Group%2026%20(dark)-min.png?raw=true"
      />

      <meta
        name="twitter:card"
        content="https://github.com/Hasan-aga/feedni/blob/master/public/Group%2026%20(dark)-min.png?raw=true"
      />
      <meta property="twitter:domain" content="feedni.hasan.one" />
      <meta property="twitter:url" content="http://feedni.hasan.one/" />
      <meta
        name="twitter:title"
        content="Feedni, The open-source content-aggregator."
      />
      <meta
        name="twitter:description"
        content="Use Feedni to follow your favorite blogs, magazines and news
      outlets"
      />
      <meta
        name="twitter:image"
        content="https://github.com/Hasan-aga/feedni/blob/master/public/Group%2026%20(dark)-min.png?raw=true"
      />
      <meta name="twitter:creator" content="@selamFromHasan" />
    </Head>
  );
}
