import { EntityTable } from '@/widgets/entity-table';
import { Card, CardContent } from '@/shared/ui/card';

import { CategoriesHeader } from './components/categories-header';

const CategoriesPage: React.FC = () => {
  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className="border-none drop-shadow-sm w-full h-fit">
        <CategoriesHeader />
        <CardContent>
          <EntityTable entity='category' />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;