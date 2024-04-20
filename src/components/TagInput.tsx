import { useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import "@/styles/tagsInput.css";
const KeyCodes = {
  comma: 188,
  column: 186,
  enter: 13,
};

import { Tag } from "react-tag-input";

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.column];

export default function TagInput({
  communitySlug,
  defaultValue,
  onChange,
}: {
  communitySlug: string;
  defaultValue?: Tag[];
  onChange: Function | undefined;
}) {
  const suggestions: Tag[] = [].map((row: { id: number; slug: string }) => {
    return {
      id: row.id + "",
      text: row.slug,
    } as Tag;
  });

  const [tags, setTags] = useState<Tag[]>(defaultValue || []);

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
        tags={tags as Tag[]}
        suggestions={suggestions as Tag[]}
        delimiters={delimiters}
        handleDelete={handleDelete}
        handleAddition={
          handleAddition as (tag: { id: string; text: string }) => void
        }
        handleDrag={
          handleDrag as (
            tag: { id: string; text: string },
            currPos: number,
            newPos: number
          ) => void
        }
        handleTagClick={handleTagClick}
        inputFieldPosition="bottom"
        inputProps={{ enterKeyHint: "enter" }}
        placeholder="Add a new tag"
        autocomplete
      />
    </div>
  );
}
