// app/stream/[gmid]/page.tsx
'use client';

import StreamContainer from "../StreamContainer";


export default function StreamLandingPage() {
  // no props needed—StreamContainer will detect lack of `gmid`
  
  return <StreamContainer />;
}
