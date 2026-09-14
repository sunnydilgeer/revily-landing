import { numeric, select, storyboard, working, type Diagram, type MethodLesson } from '../../written-methods/model'
const { states, add, teach } = storyboard('L5B')
const layout = 'long-multiplication-layout', ones = 'long-multiplication-ones', tens = 'long-multiplication-tens', carry = 'long-multiplication-carrying', apply = 'long-multiplication-application'
const column = (top: string, bottom: string, first?: string, second?: string, total?: string, carried?: { column: number; value: number }): Diagram => ({ kind: 'multiply', top, bottom, ones: first, tens: second, total, carry: carried })
const text = (...lines: string[]): Diagram => ({ kind: 'text', lines })
const method = 'Multiply by the ones digit from right to left. Then multiply by the value of the tens digit, keeping a zero in the ones column. Add the aligned rows.'
teach(layout, 'Split a large multiplication into two parts', { kind: 'area' }, 'This rectangle has 14 rows and 12 columns. Select each part to see how 12 columns split into 10 and 2.')
add(tens, 'What is the value of the 2 in 23?', text('23 = 2 tens + 3 ones'), select(['2', '20', '200'], 1), working('20', ['Find the place of the digit.', 'The 2 is in the tens column.'], ['Use its value.', '2 tens = 20.']), 'Multiply the digit by the value of its column. One ten is worth 10.')
teach(layout, 'Two partial products make the whole product', { kind: 'worked', initial: column('23', '12'), steps: [
  { diagram: column('23', '12', '46'), text: 'Align ones under ones. Start with the bottom ones digit: 23 × 2 = 46.' },
  { diagram: column('23', '12', '46', '230'), text: 'The bottom 1 means 10. The second row is 23 × 10 = 230.' },
  { diagram: column('23', '12', '46', '230', '276'), text: 'Add the two partial products: 46 + 230 = 276.' },
] })
add(layout, 'Which bottom digit do we use first?', column('42', '13'), select(['The 1 in the tens column', 'The 3 in the ones column'], 1), working('The 3 in the ones column.', ['Start with ones.', 'The first row is 42 × 3.'], ['Leave tens for the second row.', 'The second row will be 42 × 10.']), 'In long multiplication, begin with the bottom digit on the right.')
add(ones, 'What is the first partial product, 42 × 3?', column('42', '13'), numeric(126), working('126', ['Multiply ones.', '3 × 2 = 6.'], ['Multiply tens.', '3 × 4 tens = 12 tens. Together this is 126.']), 'Multiply each digit of 42 by 3, working from right to left.')
add(tens, 'What does the second row represent?', column('42', '13', '126'), select(['42 × 1', '42 × 10', '126 × 10'], 1), working('42 × 10', ['Read the remaining bottom digit.', 'The 1 in 13 is worth 10.'], ['Use the original top number.', 'Multiply 42 by 10 for the second row.']), 'The second row uses the tens digit’s value and the original top number.')
add(tens, 'Calculate the second partial product', column('42', '13', '126', '0'), numeric(420), working('420', ['Use the value of the tens digit.', '1 ten = 10.'], ['Multiply by 10.', '42 × 10 = 420.']), 'The bottom 1 is one ten. Multiplying by 10 moves each digit one place to the left.')
add(tens, 'Add the two partial products', column('42', '13', '126', '420'), numeric(546), working('546', ['Add matching columns.', 'Ones: 6 + 0 = 6. Tens: 2 + 2 = 4.'], ['Add hundreds.', '1 + 4 = 5, giving 546.']), 'Align ones, tens and hundreds. Add each column, carrying if a total reaches 10.')
teach(carry, 'Regroup a product that is too large for one column', { kind: 'worked', initial: column('281', '23'), steps: [
  { diagram: column('281', '23', '3'), text: '3 × 1 = 3. Write 3 in the ones column.' },
  { diagram: column('281', '23', '43', undefined, undefined, { column: 2, value: 2 }), text: '3 × 8 tens = 24 tens. Write 4 tens and carry 2 hundreds.' },
  { diagram: column('281', '23', '843'), text: '3 × 2 hundreds + 2 carried hundreds = 8 hundreds. First row: 843.' },
  { diagram: column('281', '23', '843', '0'), text: 'The next digit is worth 20. Start a new row with zero ones.' },
  { diagram: column('281', '23', '843', '20'), text: '2 tens × 1 = 2 tens. Write 2 in the tens column.' },
  { diagram: column('281', '23', '843', '620', undefined, { column: 3, value: 1 }), text: '2 tens × 8 tens = 16 hundreds. Write 6 hundreds and carry 1 thousand.' },
  { diagram: column('281', '23', '843', '5620'), text: '2 tens × 2 hundreds + 1 carried thousand = 5 thousands. Second row: 5,620.' },
  { diagram: column('281', '23', '843', '5620', '6463'), text: '843 + 5,620 = 6,463. Add the two rows in their columns.' },
] })
add(carry, 'How do you record 24 tens?', text('3 × 8 tens = 24 tens'), select(['Write 2 tens and carry 4 hundreds', 'Write 4 tens and carry 2 hundreds', 'Write 24 in the tens column'], 1), working('Write 4 tens and carry 2 hundreds.', ['Exchange tens for hundreds.', '24 tens = 2 hundreds + 4 tens.'], ['Keep one digit in each column.', 'Write 4 in tens and carry 2 into hundreds.']), 'Ten tens make one hundred. Split the amount into whole hundreds and remaining tens.')
add(carry, 'What is 3 × 2 + the carried 2?', column('281', '23', '43', undefined, undefined, { column: 2, value: 2 }), numeric(8), working('8', ['Multiply before adding the carry.', '3 × 2 = 6.'], ['Include the carried hundreds.', '6 + 2 = 8.']), 'Multiply the next digit first. Add the carry once, after multiplying.')
add(tens, 'A learner uses 562 as the second row. What is missing?', text('281 × 23', 'First row: 843', 'Second row: 562'), select(['The carried 2', 'The zero that makes it 281 × 20', 'A decimal point'], 1), working('The second row should be 5,620.', ['Read the tens digit by value.', 'The 2 in 23 means 20.'], ['Scale the product by 10.', '281 × 2 = 562, so 281 × 20 = 5,620.']), 'Compare multiplying by 2 with multiplying by 2 tens. The second row must use the tens value.', 'transfer')
add(carry, 'Calculate 132 × 24', column('132', '24'), numeric(3168), working('3,168', ['Multiply by 4.', '132 × 4 = 528.'], ['Multiply by 20.', '132 × 20 = 2,640.'], ['Add the rows.', '528 + 2,640 = 3,168.']), method, 'independent')
teach(carry, 'A carry can be needed in more than one column', { kind: 'worked', initial: column('347', '26'), steps: [
  { diagram: column('347', '26', '2', undefined, undefined, { column: 1, value: 4 }), text: '6 × 7 = 42. Write 2 ones and carry 4 tens.' },
  { diagram: column('347', '26', '82', undefined, undefined, { column: 2, value: 2 }), text: '6 × 4 + 4 = 28 tens. Write 8 tens and carry 2 hundreds.' },
  { diagram: column('347', '26', '2082'), text: '6 × 3 + 2 = 20 hundreds. First row: 2,082.' },
  { diagram: column('347', '26', '2082', '0'), text: 'Begin the ×20 row with a zero in ones.' },
  { diagram: column('347', '26', '2082', '40', undefined, { column: 2, value: 1 }), text: '2 tens × 7 = 14 tens. Write 4 tens and carry 1 hundred.' },
  { diagram: column('347', '26', '2082', '940'), text: '2 × 4 + 1 = 9 hundreds. The carry has now been used.' },
  { diagram: column('347', '26', '2082', '6940'), text: '2 tens × 3 hundreds = 6 thousands. Second row: 6,940.' },
  { diagram: column('347', '26', '2082', '6940', '9022'), text: 'Add 2,082 and 6,940. In tens, 8 + 4 = 12: write 2 and carry 1. In hundreds, 0 + 9 + 1 = 10: write 0 and carry 1. Total: 9,022.' },
] })
add(carry, 'What is 6 × 4 + the carried 4?', column('347', '26', '2', undefined, undefined, { column: 1, value: 4 }), numeric(28), working('28', ['Multiply the tens digit.', '6 × 4 = 24.'], ['Add the previous carry.', '24 + 4 = 28. Write 8 tens and carry 2 hundreds.']), 'The carry comes from the previous column. Add it to the new product, rather than multiplying it.')
add(carry, 'Calculate 268 × 34', column('268', '34'), numeric(9112), working('9,112', ['Multiply by 4.', '4 × 8 = 32; 4 × 6 + 3 = 27; 4 × 2 + 2 = 10. First row: 1,072.'], ['Multiply by 30.', '268 × 3 = 804, so the tens row is 8,040.'], ['Add the rows.', '1,072 + 8,040 = 9,112.']), method + ' Include each carry once.', 'independent')
teach(carry, 'Zero is still a column to work through', { kind: 'worked', initial: column('405', '32'), steps: [
  { diagram: column('405', '32', '0', undefined, undefined, { column: 1, value: 1 }), text: '2 × 5 = 10. Write 0 ones and carry 1 ten.' },
  { diagram: column('405', '32', '10'), text: '2 × 0 + 1 = 1 ten. Use the carry even when the top digit is zero.' },
  { diagram: column('405', '32', '810'), text: '2 × 4 = 8 hundreds. First row: 810.' },
  { diagram: column('405', '32', '810', '50', undefined, { column: 2, value: 1 }), text: 'Begin with zero ones. 3 tens × 5 = 15 tens: write 5 tens and carry 1 hundred.' },
  { diagram: column('405', '32', '810', '150'), text: '3 × 0 + 1 = 1 hundred. The zero column still receives the carry.' },
  { diagram: column('405', '32', '810', '12150'), text: '3 tens × 4 hundreds = 12 thousands. Second row: 12,150.' },
  { diagram: column('405', '32', '810', '12150', '12960'), text: 'Add 810 + 12,150 = 12,960.' },
] })
add(carry, 'Can you skip the zero column when a carry enters it?', text('405 × 2', 'A carry of 1 enters the tens column'), select(['Yes — anything times zero is zero', 'No — multiply by zero, then add the carry'], 1), working('No. The tens digit is 1 after adding the carry.', ['Multiply the zero digit.', '2 × 0 = 0 tens.'], ['Include the carried ten.', '0 + 1 = 1 ten. The complete product is 810.']), 'A zero digit contributes no new product, but a carry from the previous column still has value.', 'transfer')
add(carry, 'Calculate 306 × 24', column('306', '24'), numeric(7344), working('7,344', ['Multiply by 4, including the zero column.', '4 × 6 = 24; 4 × 0 + 2 = 2; 4 × 3 = 12. First row: 1,224.'], ['Multiply by 20.', '306 × 20 = 6,120.'], ['Add the rows.', '1,224 + 6,120 = 7,344.']), method + ' A zero column can still receive a carry.', 'independent')
add(apply, 'Which calculation finds the total number of seats?', text('18 rows', '246 seats in each row'), select(['246 + 18', '246 ÷ 18', '246 × 18'], 2), working('246 × 18', ['Recognise equal groups.', 'There are 18 equal groups of 246 seats.'], ['Use multiplication for repeated addition.', 'Total seats = seats per row × number of rows.']), 'The same number of seats appears in every row. Choose the operation for equal groups.')
add(apply, 'How many seats are there altogether?', text('18 rows × 246 seats'), numeric(4428), working('4,428 seats', ['Multiply by 8 rows.', '246 × 8 = 1,968.'], ['Multiply by 10 rows.', '246 × 10 = 2,460.'], ['Combine the rows.', '1,968 + 2,460 = 4,428 seats.']), 'Split the 18 rows into 10 rows and 8 rows. Calculate both seat totals and add them.', 'transfer')
teach(apply, 'Scaling a factor scales the product', { kind: 'scale' }, 'Switch either factor between its original value and ten times that value. Watch what happens to the product.')
add(apply, 'Use the known fact to find 240 × 16', text('24 × 16 = 384'), numeric(3840), working('3,840', ['Compare the factors.', '240 is 10 times 24; 16 is unchanged.'], ['Scale the product by the same factor.', '384 × 10 = 3,840.']), 'Compare each new factor with the matching factor in the known fact. Apply that change to the product.')
add(apply, 'Use the known fact to find 29.6 × 32', text('2.96 × 3.2 = 9.472'), numeric(947.2), working('947.2', ['Find both changes.', '29.6 is 10 times 2.96; 32 is 10 times 3.2.'], ['Combine the scale factors.', '10 × 10 = 100, so 9.472 × 100 = 947.2.']), 'Compare the first factors, then the second factors. Multiply the two scale factors to find the change in the product.', 'transfer')
add('mixed', 'Select both true statements about 152 × 23', column('152', '23'), { type: 'multiSelect', options: [
  { id: '0', label: 'The first row is 152 × 3.' }, { id: '1', label: 'The second row is 152 × 2.' }, { id: '2', label: 'Add the ×3 and ×20 rows.' }, { id: '3', label: 'Multiply the two partial products together.' },
], correctAnswer: ['0', '2'], acceptanceRule: 'unorderedSet' }, working('The first row is 152 × 3; add the ×3 and ×20 rows.', ['Split the bottom number by place.', '23 = 20 + 3.'], ['Combine the two parts.', '152 × 23 = (152 × 20) + (152 × 3).']), 'Split 23 into tens and ones. Each part multiplies the original top number. Think how the parts combine to make the whole.', 'transfer')
teach('mixed', 'You’ve reached the end', text('Ones row + tens row', 'Multiply, then add each carry', 'Scale each factor to scale the product'), 'Keep matching places aligned. Read a tens digit by its value and include every carry, even in a zero column.')
export const longMultiplicationVariantB: MethodLesson = { id: 'L005-B', title: 'Long multiplication', level: 'GCSE Foundation', goal: 'Use place value and partial products to multiply, carry and scale known facts.', states }
