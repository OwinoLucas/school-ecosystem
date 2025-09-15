// This is a Node.js script to add useEffect data fetching to all updated pages
// Run this with: node add-data-fetching.js

const fs = require('fs');
const path = require('path');

const pages = [
  'frontend/src/app/(dashboard)/list/classes/page.tsx',
  'frontend/src/app/(dashboard)/list/lessons/page.tsx',
  'frontend/src/app/(dashboard)/list/exams/page.tsx',
  'frontend/src/app/(dashboard)/list/assignments/page.tsx',
  'frontend/src/app/(dashboard)/list/results/page.tsx',
  'frontend/src/app/(dashboard)/list/events/page.tsx',
  'frontend/src/app/(dashboard)/list/announcements/page.tsx'
];

const dataFetchingTemplate = `
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { page, ...queryParams } = searchParams;
        const p = page ? parseInt(page) : 1;

        // Build query object for filtering
        const query: any = {};
        
        if (queryParams) {
          for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
              switch (key) {
                case "classId":
                  query.classId = parseInt(value);
                  break;
                case "teacherId":
                  query.teacherId = value;
                  break;
                case "search":
                  query.search = value;
                  break;
                default:
                  break;
              }
            }
          }
        }

        // Use mock data service temporarily
        const [modelData, modelCount] = await mockDataService.$transaction([
          mockDataService.MODEL_NAME.findMany({
            where: query,
            include: {},
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
          }),
          mockDataService.MODEL_NAME.count({ where: query }),
        ]);
        
        setData(modelData);
        setCount(modelCount);
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [searchParams]);
  
  const { page } = searchParams;
  const p = page ? parseInt(page) : 1;
  
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }
`;

const modelMappings = {
  'classes': 'classes',
  'lessons': 'lessons', 
  'exams': 'exams',
  'assignments': 'assignments',
  'results': 'results',
  'events': 'events',
  'announcements': 'announcements'
};

pages.forEach(pagePath => {
  const fileName = path.basename(path.dirname(pagePath));
  const modelName = modelMappings[fileName] || fileName;
  
  // Read the file
  if (!fs.existsSync(pagePath)) {
    console.log(`File not found: ${pagePath}`);
    return;
  }
  
  let content = fs.readFileSync(pagePath, 'utf8');
  
  // Replace placeholder with actual model name
  let fetchingCode = dataFetchingTemplate.replace(/MODEL_NAME/g, modelName);
  
  // Find where to insert the useEffect (after the loading state declaration)
  const insertPoint = content.indexOf('const [loading, setLoading] = useState(true);');
  
  if (insertPoint === -1) {
    console.log(`Could not find insertion point in ${pagePath}`);
    return;
  }
  
  // Find the end of that line
  const lineEnd = content.indexOf('\n', insertPoint);
  
  // Check if useEffect already exists
  if (content.includes('useEffect(() => {')) {
    console.log(`useEffect already exists in ${pagePath}`);
    return;
  }
  
  // Insert the useEffect code after the loading state
  const beforeInsert = content.substring(0, lineEnd + 1);
  const afterInsert = content.substring(lineEnd + 1);
  
  const newContent = beforeInsert + fetchingCode + afterInsert;
  
  // Write back to file
  fs.writeFileSync(pagePath, newContent, 'utf8');
  console.log(`Updated ${pagePath}`);
});

console.log('Data fetching logic added to all pages!');