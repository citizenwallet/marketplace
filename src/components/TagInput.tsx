import { useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import "@/styles/tagsInput.css";
const KeyCodes = {
  comma: 188,
  enter: 13,
};

interface Tag {
  id: number;
  text: string;
}

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function TagInput({
  communitySlug,
  onChange,
}: {
  communitySlug: string;
  onChange: Function | undefined;
}) {
  const suggestions: Tag[] = [].map((row) => {
    return {
      id: row.id,
      text: row.slug,
    } as Tag;
  });

  const [tags, setTags] = useState<Tag[]>([]);

  const handleDelete = (i: number) => {
    const newTags = tags.filter((tag, index) => index !== i);
    setTags(newTags);
    if (onChange) {
      onChange(newTags);
    }
  };

  const handleAddition = (tag: Tag) => {
    const newTags = [...tags, tag];
    setTags(newTags);
    if (onChange) {
      onChange(newTags);
    }
  };

  const handleDrag = (tag: Tag, currPos: number, newPos: number) => {
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    setTags(newTags);
  };

  const handleTagClick = (index: number) => {
    console.log("The tag at index " + index + " was clicked");
  };

  return (
    <div className="app">
      <ReactTags
        tags={tags}
        suggestions={suggestions}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        handleDrag={handleDrag}
        handleTagClick={handleTagClick}
        inputFieldPosition="bottom"
        placeholder="Add a new tag"
        autocomplete
      />
    </div>
  );
}
