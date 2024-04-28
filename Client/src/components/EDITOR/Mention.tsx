import { useFocused, useSelected } from 'slate-react';

const Mention = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  const style: React.CSSProperties = {
    padding: '3px 3px 2px',
    margin: '0 1px',
    verticalAlign: 'baseline',
    display: 'inline-block',
    borderRadius: '4px',
    backgroundColor: '#eee',
    fontSize: '0.9em',
    boxShadow: selected && focused ? '0 0 0 2px #B4D5FF' : 'none',
  };
  // See if our empty text child has any styling marks applied and apply those
  if (element.children[0].bold) {
    style.fontWeight = 'bold';
  }
  if (element.children[0].italic) {
    style.fontStyle = 'italic';
  }
  return (
    <span
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(' ', '-')}`}
      className='text-blue-900 font-semibold inline-block cursor-pointer '
    >
      ${element.character}
      {children}
    </span>
  );
};

export default Mention;
