// import ProfileForm from '@/components/AuthComponents/profile-form';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Progress } from '@/components/ui/progress';
// import { useState } from 'react';
// import { useLocation } from 'react-router-dom';

// export default function OnBoardingPage() {
//     const location = useLocation();
//     const passedState = location.state;

//     const [progress, setProgress] = useState<number>(22);

//     console.log(passedState);
//     return (
//         <main className='bg-slate-950 min-h-screen flex justify-center items-center py-13'>
//             <Card>

//                 <CardContent className='p-5 flex flex-col justify-center items-center'>
//                     <h1 className="text-3xl text-white font-bold mb-4">Välkommen {passedState.user.givenName}!</h1>
//                     <p className="text-slate-400 mb-6">Set up your profile</p>
//                     {/* <Progress className='mb-4' value={progress} /> */}

//                     <ProfileForm collectResponse={
//                         {
//                             givenName: passedState.user.givenName,
//                             surname: passedState.user.surname,
//                             personalNumber: passedState.user.personalNumber,
//                             name: passedState.user.name,
//                         }
//                     } />

//                 </CardContent>

//             </Card>
//         </main>

//     );
// }
