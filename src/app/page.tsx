
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import StudentCheckIn from '@/components/StudentCheckIn';
import AdminLogin from '@/components/AdminLogin';
import { Toaster } from '@/components/ui/toaster';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const bgImage = PlaceHolderImages.find(img => img.id === 'library-bg');

  return (
    <main className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Decorative Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage?.imageUrl || 'https://picsum.photos/seed/library/1200/800'}
          alt="Library Background"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-accent/20" />
      </div>

      <div className="w-full max-w-xl z-10">
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary mb-2 drop-shadow-sm">
            EduRegister Scan
          </h1>
          <div className="h-1 w-24 bg-accent mx-auto rounded-full" />
        </div>

        <Card className="border-primary/20 shadow-2xl bg-white/80 backdrop-blur-md">
          <CardContent className="p-0">
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="w-full grid grid-cols-2 h-14 rounded-none border-b border-primary/10 bg-transparent p-0">
                <TabsTrigger 
                  value="student" 
                  className="rounded-none h-full data-[state=active]:bg-primary data-[state=active]:text-white font-headline text-lg"
                >
                  Student Check-in
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  className="rounded-none h-full data-[state=active]:bg-primary data-[state=active]:text-white font-headline text-lg"
                >
                  Admin Portal
                </TabsTrigger>
              </TabsList>
              
              <div className="p-8">
                <TabsContent value="student" className="mt-0 focus-visible:outline-none">
                  <StudentCheckIn />
                </TabsContent>
                <TabsContent value="admin" className="mt-0 focus-visible:outline-none">
                  <AdminLogin />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center mt-8 text-muted-foreground font-body text-sm">
          &copy; {new Date().getFullYear()} EduRegister Scan. All rights reserved for New Era University.
        </p>
      </div>
      <Toaster />
    </main>
  );
}
