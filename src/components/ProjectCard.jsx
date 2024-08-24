import Link from "next/link";
import AOS from "aos"; // Importa AOS
import "aos/dist/aos.css"; // Importa los estilos de AOS

const ProjectCard = ({ project }) => {
  
  return (
    <Link
      key={project._id}
      href={`/${project.author}/${encodeURIComponent(project.title)}`}
    >
      <div
        data-aos="fade-up"
        className="relative rounded-lg overflow-hidden hover:transform hover:-translate-y-1 hover:shadow-lg transition duration-300 ease-in-out shadow-md bg-white dark:bg-gray-800"
      >
        <img
          className="w-full h-60 object-cover"
          src={project.banner}
          alt={project.title}
        />
        <div className="absolute bottom-0 h-full left-0 p-4  bg-gradient-to-t dark:from-black from-white to-transparent w-full">
          <div className="flex items-center">
            <div className="ml-3 text-white absolute bottom-5 flex">
              <img
                src={project.authorImage}
                alt={`${project.author}'s profile`}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex flex-col ml-4 dark:text-white text-black">
                <div className="text-lg font-bold dark:text-white text-black">
                  {project.title}
                </div>
                <div className="text-xs dark:text-white text-black">
                  {project.author}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-5 right-5 px-5 py-2 bg-black bg-opacity-75 text-white text-xs font-semibold">
          {project.projectType}
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
