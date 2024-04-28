import { Button } from '@/components/ui/button';
import { SignInButton, SignUpButton, useAuth } from '@clerk/clerk-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function AuthPage() {
  const { isSignedIn } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) {
      navigate('/home');
    }
  }, [isSignedIn, navigate]);

  // async function handleSignUp() {

  //     console.log("clicked");
  //     try {
  //         const loginResponse = await axios.post('http://localhost:3000/api/login', {
  //             endUserIp: "127.0.0.1",
  //             redirectUrl: "http://localhost:5173",
  //         });

  //         // Redirect the user
  //         window.location.href = loginResponse.data.url;

  //         // Assuming you handle the redirection and come back to this script for further processing
  //         const orderRef = loginResponse.data.orderRef;
  //         const collectResponse = await axios.post('http://localhost:3000/api/collect', {
  //             orderRef: orderRef,
  //         });

  //         console.log(collectResponse.data);

  //         navigate("/onboarding", { state: collectResponse.data.completionData as bankIdAuthResponse });
  //         // setBankIdAuthed(true);

  //         // // After collect request, make a request to /api/clerk-auth
  //         // const clerkAuthResponse = await axios.post('http://localhost:3000/api/clerk-auth', {
  //         //     // include necessary data for this request
  //         //     firstName: collectResponse.data.completionData.user.givenName,
  //         //     lastName: collectResponse.data.completionData.user.surname,
  //         //     personalNumber: collectResponse.data.completionData.user.personalNumber,
  //         //     email: ["email@hotmail.com"]
  //         // });

  //         // console.log(clerkAuthResponse.data);

  //         // await handleSignIn("email@hotmail.com", "Testing123!?Testing");

  //     } catch (err) {
  //         console.error(err);
  //     }
  // }

  // const handleSignIn = async (email: string, password: string) => {
  //     if (!isLoaded) {
  //         return;
  //     }
  //     try {
  //         await signIn.create({
  //             identifier: email,
  //             password: password,

  //         }).then((res) => {
  //             if (res.status === "complete") {
  //                 console.log(res);
  //                 setActive({ session: res.createdSessionId });
  //             }
  //         }
  //         );
  //     } catch (err) {
  //         console.error(err);
  //     }
  // }

  return (
    // <div className="bg-red-200">
    //     <Dialog>
    //         <DialogTrigger asChild>
    //             <Button variant="outline">Sign up with BankId</Button>
    //         </DialogTrigger>
    //         <DialogContent >
    //             {bankIdAuthed ? (
    //                 <><DialogHeader>
    //                     <DialogTitle>Welcome ...</DialogTitle>
    //                     <DialogDescription>
    //                         Set up your profile
    //                     </DialogDescription>
    //                 </DialogHeader><Separator /><ProfileForm /></>
    //             ) : (
    //                 <DialogHeader>
    //                     <DialogTitle>BankId shit</DialogTitle>
    //                     <DialogDescription>
    //                         scan teh shit
    //                     </DialogDescription>
    //                     <Button onClick={() => setBankIdAuthed(true)}>temp next btn</Button>
    //                     <Button onClick={handleSignUp}>BankID på denna enhet</Button>
    //                 </DialogHeader>
    //             )}

    //         </DialogContent>
    //     </Dialog>
    // </div>
    <>
      <main className='flex flex-col lg:flex-row h-screen '>
        <section className='lg:w-3/4 bg-slate-950/95 hidden lg:block'>
          <div className='p-4 dark:text-slate-300'>AL</div>
        </section>
        <aside className='lg:w-2/5 bg-slate-950 items-center flex justify-center h-full lg:h-auto'>
          <Card className='w-full items-center'>
            <CardHeader>-</CardHeader>
            {/* <CardHeader>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Join the community and start discussing with fellow investors.
                            </p>
                        </CardHeader> */}
            <CardContent className='gap-2 flex flex-col'>
              <SignUpButton mode='modal'>
                <Button variant={'default'}>Sign up</Button>
              </SignUpButton>

              {/* 
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline">Sign up</Button>
                                </DialogTrigger>
                                <DialogContent >

                                    <DialogHeader>
                                        <DialogTitle className="dark:text-slate-300">Bli medlem</DialogTitle>

                                    </DialogHeader><Separator />

                                    {annanEnhet ? (

                                        <div className="flex flex-col w-full justify-center">

                                            <div className="flex flex-col  items-center justify-center">
                                                <QRCode value="test" className="w-1/3" />
                                                <h2 className="dark:text-slate-300">Starta BankID-appen på din andra enhet

                                                </h2>
                                            </div>


                                            <Button className="mt-4" variant={"destructive"} onClick={() => setAnnanEnhet(!annanEnhet)}>Avbryt</Button>


                                        </div>

                                    ) : dennaEnhet ? (

                                        <div className="flex flex-col w-full justify-center">
                                            <div className="flex flex-col  items-center gap-4 justify-center">
                                                <div className="border-gray-600 h-20 w-20 animate-spin rounded-full border-8 border-t-slate-300" />
                                                <Button onClick={() => setDennaEnhet(false)} variant={"destructive"}>Avbryt</Button>
                                            </div>
                                        </div>
                                    ) : (

                                        <div className="flex flex-col w-full justify-center">

                                            <div className="flex justify-center">
                                                <img src={bankIdLogo} alt="BankId Logo" className="w-1/2" />
                                            </div>

                                            <span className="flex flex-col gap-3">
                                                <Button onClick={() => setAnnanEnhet(true)}>BankID på annan enhet</Button>
                                                <Button onClick={handleSignUp} variant={"secondary"}>BankID på denna enhet</Button>
                                            </span>
                                        </div>
                                    )}






                                </DialogContent>
                            </Dialog> */}
              {/* 

                            <Button onClick={handleSignUp}>Sign In</Button> */}

              <SignInButton mode='modal'>
                <Button variant='secondary'>Sign in</Button>
              </SignInButton>
            </CardContent>
          </Card>
        </aside>
      </main>
    </>
  );
}
