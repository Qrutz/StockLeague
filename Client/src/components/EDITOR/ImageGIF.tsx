import { Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';

import { Cross1Icon } from '@radix-ui/react-icons';

const ImageGif = ({ attributes, children, element }) => {
  const editor = useSlateStatic();

  const removeImage = () => {
    const path = ReactEditor.findPath(editor, element);
    Transforms.removeNodes(editor, { at: path });
  };

  return (
    <div {...attributes} className='relative inline-block'>
      <div contentEditable={false} className='group'>
        <img
          src={element.url}
          alt=''
          className='block max-w-full max-h-[20em] m-auto'
        />
        <div className='absolute top-0 right-0'>
          {/* Wrap the button in a div to apply Tailwind classes for styling and positioning */}
          <div
            onClick={removeImage}
            className='absolute top-0 right-0 mt-2 mr-2 p-2 bg-gray-800 text-white cursor-pointer rounded-full'
          >
            {/* Tailwind CSS for semi-transparent background, padding, and margin */}

            <Cross1Icon />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ImageGif;
