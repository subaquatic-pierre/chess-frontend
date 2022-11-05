import React, { Suspense, useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// const Layout = React.lazy(() => import('./src/layout'));
import Layout from './src/layout';

// export const wrapPageElement = ({ el, props }) => {
//   const [wasmLoaded, setWasmLoaded] = useState(false);

//   useEffect(() => {
//     setWasmLoaded(true);
//   }, []);

//   return (
//     <Suspense fallback={<></>}>{wasmLoaded && <Layout>{el}</Layout>}</Suspense>
//   );
// };
