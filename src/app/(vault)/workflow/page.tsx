import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function WorkflowPage() {
  return (
    <div className="w-full min-h-screen flex flex-col text-white">
      {/* Users from Workspace Section */}
      <div className='px-5 flex justify-start'>
        <div>
          <Image src="https://github.com/96vini.png" alt='User Profile' width={128} height={128} className='w-8 h-8 rounded-3xl' />
        </div>
        <div>
          <Image src="https://github.com/96vini.png" alt='User Profile' width={128} height={128} className='w-8 h-8 rounded-3xl' />
        </div>
        <div>
          <Image src="https://github.com/96vini.png" alt='User Profile' width={128} height={128} className='w-8 h-8 rounded-3xl' />
        </div>
      </div>
      <div className="flex flex-1 p-4">
        <div className="w-full h-[80vh] flex-1 grid grid-cols-4 rounded-2xl shadow-xl bg-[#111] p-4 gap-4">
          <Card className='pt-6 border-1 border-dashed'>
            <CardContent>
              
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}