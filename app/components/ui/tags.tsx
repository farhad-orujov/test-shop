import clsx from "clsx"

interface TagsProps {
    classname?: string;
    tags: string[];
}

export const Tags: React.FC<TagsProps> = ({ classname, tags }) => {
    return (
        <div className={clsx("flex flex-wrap gap-2", classname)}>
            {tags.map((tag, index) => (
                <div key={index} className="bg-neutral-200 text-neutral-900 text-sm px-2 py-1 rounded-md">
                    {tag}
                </div>
            ))}
        </div>
    )
}