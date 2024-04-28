import React, {
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useState,
  RefObject,
} from 'react';
import {
  Editor,
  Transforms,
  Range,
  createEditor,
  Descendant,
  BaseEditor,
  Node,
  Text,
} from 'slate';

import { withHistory } from 'slate-history';
import { Slate, Editable, ReactEditor, withReact } from 'slate-react';
import { Card } from '../ui/card';

import { Button } from '../ui/button';

import { Separator } from '../ui/separator';
import CircleProgress from '../CharacterCounter';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth, useUser } from '@clerk/clerk-react';
import { TbTargetArrow } from 'react-icons/tb';

import PredictionModal from '../PostComponents/PredictionModal';

import GifHandler from '../PostComponents/GifHandler';
import Mention from './Mention';
import ImageGif from './ImageGIF';
import Lolt from './Lolt';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

type MentionElement = {
  type: 'mention';
  character: string;
  children: CustomText[];
};

type SlateElementTypes =
  | { type: 'paragraph'; children: Descendant[] }
  | { type: 'bulleted-list'; children: Descendant[] }
  | { type: 'list-item'; children: Descendant[] }
  | { type: 'image'; url: string; children: Descendant[] }
  // Add more built-in or custom types as needed
  | MentionElement
  | LoltElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: SlateElementTypes;
    Text: CustomText;
  }
}

type LoltElement = {
  type: 'test';
  prediction: PredictionData;
  children: CustomText[];
};

type CustomText = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  text: string;
};

interface PredictionData {
  ticker: string;
  movement: string;
  byDate: string;
}

interface Props {
  commentMode?: boolean;
}

const PostCreatorv2 = ({ commentMode = false }: Props) => {
  const { user } = useUser();

  const ref = useRef<HTMLDivElement | null>();
  const { getToken } = useAuth();
  const [target, setTarget] = useState<Range | undefined>();
  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');
  const [value, setValue] = useState<Descendant[]>(initialValue);
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withMentions(withReact(withHistory(createEditor()))),
    []
  );
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // state to store prediction if it is made
  const [prediction, setPrediction] = useState<PredictionData | null>(null);

  const mutation = useMutation({
    mutationFn: handlePostSubmit,
    onSuccess: () => {
      // cant invalidate here because the post takes a while to be created
      console.log('success');
    },
  });

  async function handlePostSubmit() {
    const token = await getToken();
    // Get the raw text from the editor including the mentions
    const text = serializeContentWithMentions(editor.children);

    // get the gif url if it exists
    const gif = editor.children.find((node) => node.type === 'image');

    const mentionedTickers = extractMentionedTickers(editor.children);
    // get the prediction if it exists

    const prediction1 = prediction;

    console.log('prediction equals' + prediction1);

    console.log(mentionedTickers);
    // const res = await axios.post(
    //   'http://localhost:3000/api/posts',
    //   {
    //     content: text,
    //     gifUrl: gif ? gif.url : null,
    //     prediction: {
    //       ticker: prediction?.ticker,
    //       predictedMovement: prediction?.movement,
    //       dateAtFinal: prediction?.byDate,
    //     },
    //   },
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );

    // return res.data;
  }

  // This function iterates over all nodes and extracts tickers from mention nodes
  function extractMentionedTickers(nodes) {
    const tickers: string[] = [];

    const processNode = (node) => {
      if (node.type === 'mention') {
        // check if it isnt alreadey in the array
        if (!tickers.includes(node.character)) {
          tickers.push(node.character); // Assuming `node.character` is the ticker symbol
        }
      } else if (node.children) {
        node.children.forEach(processNode);
      }
    };

    nodes.forEach(processNode);
    return tickers;
  }

  const serializeContentWithMentions = (nodes) => {
    let serialized = '';

    const processNode = (node) => {
      if (Text.isText(node)) {
        serialized += node.text;
      } else if (node.type === 'mention') {
        // Assuming your mention nodes might look like this and have a `character` property
        serialized += `$${node.character}`;
      } else if (node.children) {
        node.children.forEach(processNode);
      }
    };

    nodes.forEach(processNode);

    return serialized;
  };

  const chars = STOCKS.filter((c) =>
    c.toLowerCase().startsWith(search.toLowerCase())
  ).slice(0, 10);

  const countCharacters = (editor) => {
    // Convert the editor's content into plain text
    const text = Node.string(editor);
    // Return the length of the text
    return text.length;
  };

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (target && chars.length > 0) {
        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            // eslint-disable-next-line no-case-declarations
            const prevIndex = index >= chars.length - 1 ? 0 : index + 1;
            setIndex(prevIndex);
            break;
          case 'ArrowUp':
            event.preventDefault();
            // eslint-disable-next-line no-case-declarations
            const nextIndex = index <= 0 ? chars.length - 1 : index - 1;
            setIndex(nextIndex);
            break;
          case 'Tab':
          case 'Enter':
            event.preventDefault();
            Transforms.select(editor, target);
            insertMention(editor, chars[index]);
            setTarget(undefined);
            break;
          case 'Escape':
            event.preventDefault();
            setTarget(undefined);
            break;
        }
      }
    },
    [chars, editor, index, target]
  );

  const handleRecievePredictionData = (data) => {
    // set the prediction data
    console.log(data);
    setPrediction(data);

    // insert the prediction into the editor
    insertLolt(editor, data);

    // set prediction state for the post submit
  };

  const handleRecieveGIFData = (gif) => {
    // insert the gif into the editor
    insertImage(editor, gif.url);
  };

  useEffect(() => {
    if (target && chars.length > 0) {
      const el = ref.current;
      if (el) {
        const domRange = ReactEditor.toDOMRange(editor as ReactEditor, target);
        const rect = domRange.getBoundingClientRect();
        el.style.top = `${rect.top + window.scrollY + 24}px`;
        el.style.left = `${rect.left + window.scrollX}px`;
      }
    }
  }, [chars.length, editor, index, search, target]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Upload the file here and get back the URL
    // For demonstration, we'll skip the upload logic and use a placeholder URL
    const url = URL.createObjectURL(file);

    // Now, insert the image URL into the editor
    insertImage(editor, url);
  };

  const insertImage = (editor: ReactEditor, url: string) => {
    const image = { type: 'image', url, children: [{ text: '' }] };

    // make it so we cannot insert text after the image
    Transforms.insertNodes(editor, {
      type: 'paragraph',
      children: [{ text: '' }],
    });

    // find the prediction node if it exists
    const predictionNode = editor.children.find((node) => node.type === 'test');

    // if the prediction node exists, insert the image before it
    if (predictionNode) {
      const path = ReactEditor.findPath(editor, predictionNode);
      Transforms.insertNodes(editor, image, { at: path });
      return;
    }

    // Insert
    Transforms.insertNodes(editor, image);
  };

  if (!user) {
    return null;
  }

  return (
    <div className='flex z-[10] p-4 border-b   dark:bg-slate-950 bg-white  rounded-md dark:rounded-none dark:text-white   dark:border-slate-700 gap-2 '>
      <Avatar className='h-12 w-12    '>
        <AvatarImage className='rounded-full' src={user.imageUrl} />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className='flex flex-col w-full '>
        <Slate
          editor={editor as ReactEditor & Editor}
          initialValue={value}
          onChange={(newValue) => {
            const { selection } = editor;

            if (selection) {
              setCharCount(countCharacters(editor));
            }

            if (selection && Range.isCollapsed(selection)) {
              const cursorPoint = selection.anchor;
              const beforeText = Editor.string(editor, {
                anchor: Editor.start(editor, selection.anchor.path),
                focus: cursorPoint,
              });
              const beforeMatch = beforeText.match(/\$(\w+)$/);

              if (beforeMatch) {
                // const beforeMatchStart = beforeText.length - beforeMatch[0].length;
                const beforeRangeStart =
                  Editor.before(editor, cursorPoint, {
                    distance: beforeMatch[0].length,
                    unit: 'offset',
                  }) || cursorPoint;
                const beforeRange = Editor.range(
                  editor,
                  beforeRangeStart,
                  cursorPoint
                );

                const after = Editor.after(editor, cursorPoint);
                const afterRange = Editor.range(editor, cursorPoint, after);
                const afterText = Editor.string(editor, afterRange);
                const afterMatch = afterText.match(/^(\s|$)/); // match space or end of line

                if (afterMatch) {
                  setTarget(beforeRange);
                  setSearch(beforeMatch[1]);
                  setIndex(0);
                  return;
                }
              }
            }

            setTarget(undefined);
          }}
        >
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={onKeyDown}
            className={`bg-transparent px-4   focus-visible:ring-0  outline-none w-full border-none focus:outline-none active:border-none active:outline-none shadow-none resize-none overflow-hidden ${
              commentMode ? 'text-md' : 'text-2xl'
            }`}
            placeholder={
              commentMode ? 'Add a comment...' : 'What is on your mind?'
            }
          />
          {target && chars.length > 0 && (
            <div
              ref={ref as RefObject<HTMLDivElement> | null | undefined}
              className='top-[-9999px] left-[-9999px] absolute z-10 bg-white rounded-md shadow-md'
              data-cy='mentions-portal'
            >
              {chars.map((char, i) => (
                <Card
                  className='rounded-none   cursor-pointer flex justify-between p-3'
                  key={char}
                  onClick={() => {
                    Transforms.select(editor, target);
                    insertMention(editor, char);
                    setTarget(undefined);
                  }}
                  style={{
                    padding: '',
                    borderRadius: '',
                    background: i === index ? '#B4D5FF' : 'transparent',
                  }}
                >
                  <span className='font-bold text-xl'>{char}</span>
                  <span className='ml-2'>{char}</span>
                </Card>
              ))}
            </div>
          )}
        </Slate>

        {!commentMode && <Separator className=' my-2' />}
        <div className={`flex justify-between  ${commentMode ? 'mt-3' : ''}`}>
          <span className='flex '>
            <input
              type='file'
              accept='image/*'
              style={{ display: 'none' }}
              ref={fileInputRef} // React ref to the input for programmatic clicks
              onChange={handleImageUpload}
            />
            <Button
              variant={'ghost'}
              size={`${commentMode ? 'sm' : 'default'}`}
              onClick={() => fileInputRef.current?.click()}
            >
              IMG
            </Button>

            <GifHandler onSelect={handleRecieveGIFData}>
              <Button
                variant={'ghost'}
                size={`${commentMode ? 'sm' : 'default'}`}
              >
                GIF
              </Button>
            </GifHandler>

            <PredictionModal onPredictionSubmit={handleRecievePredictionData}>
              <Button
                size={`${commentMode ? 'sm' : 'default'}`}
                variant={'ghost'}
              >
                <TbTargetArrow
                  className={`${!commentMode ? 'w-6 h-6' : 'w-4 h-4'}`}
                />
              </Button>
            </PredictionModal>
          </span>

          <span
            className={`flex ${commentMode ? 'gap-4' : 'gap-1'} items-center `}
          >
            <CircleProgress
              progress={charCount}
              max={180}
              size={commentMode ? 25 : 30}
              strokeWidth={commentMode ? 2 : 3}
            />

            {!commentMode && (
              <Separator className=' rotate-90 w-6 bg-slate-500' />
            )}
            <Button
              onClick={() => mutation.mutate()}
              variant={`${!commentMode ? 'default' : 'secondary'}`}
              className='rounded-lg bg-blue-500 font-bold '
            >
              {commentMode ? 'Reply' : 'Post'}
            </Button>
          </span>
        </div>
      </div>
    </div>
  );
};

const withMentions = (editor: Editor) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) => {
    return element.type === 'mention' ? true : isInline(element);
  };

  editor.isVoid = (element) => {
    return element.type === 'mention' ? true : isVoid(element);
  };

  editor.markableVoid = (element) => {
    return element.type === 'mention' || markableVoid(element);
  };

  return editor;
};

const insertMention = (editor: Editor, character) => {
  const mention: MentionElement = {
    type: 'mention',
    character,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, mention);
  Transforms.move(editor);
};

const insertLolt = (editor: Editor, prediction: PredictionData) => {
  // Define the Lolt element
  const lolt: LoltElement = {
    type: 'test',
    prediction,
    children: [{ text: '' }],
  };

  // Move the selection to the end of the document
  Transforms.select(editor, Editor.end(editor, []));

  // Insert a new paragraph before the prediction if the last node is not a paragraph
  const lastNode = editor.children[editor.children.length - 1];
  if (lastNode.type !== 'paragraph') {
    const paragraph = { type: 'paragraph', children: [{ text: '' }] };
    Transforms.insertNodes(editor, paragraph);
  }

  // Insert the prediction node
  Transforms.insertNodes(editor, lolt);
};
// Borrow Leaf renderer from the Rich Text example.
// In a real project you would get this via `withRichText(editor)` or similar.
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
};

const Element = (props) => {
  const { attributes, children, element } = props;
  switch (element.type) {
    case 'mention':
      return <Mention {...props} />;
    case 'test':
      return <Lolt {...props} />;
    case 'image':
      return <ImageGif {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

const STOCKS = ['AAL', 'AAPL', 'ACB', 'AMD', ' GOOGL', 'TSLA', 'AMZN'];

export default PostCreatorv2;
