import { numeric, remainder, select, storyboard, working, type Diagram, type MethodLesson } from '../../written-methods/model'
const { states, add, teach } = storyboard('L4B')
const layout = 'short-division-layout', regroup = 'short-division-regrouping', place = 'short-division-place-value', check = 'short-division-check'
const bus = (dividend: string, divisor: number, quotient?: string, active?: number, carry?: { index: number; value: number }): Diagram => ({ kind: 'division', dividend, divisor, quotient, active, carry })
const text = (...lines: string[]): Diagram => ({ kind: 'text', lines })
const method = 'Work from left to right. Divide, write the quotient digit above its place, then regroup any remainder with the next digit.'
teach(layout, 'How many whole groups can you make?', { kind: 'groups' }, 'Use the buttons to make groups from 14 counters. Switch the group size and explore what is left over.')
add(layout, 'Which number is the divisor?', bus('84', 4), select(['84', '4', 'The answer above the line'], 1), working('4', ['Read the layout.', 'The number outside the bus stop tells us what to divide by.'], ['Name the numbers.', '84 is the dividend; 4 is the divisor.']), 'The dividend is being divided. The divisor is outside the bus stop, on the left.')
teach(layout, 'Write each answer above its own place', { kind: 'worked', initial: bus('84', 4), steps: [
  { diagram: bus('84', 4, '2 ', 0), text: '8 tens ÷ 4 = 2 tens. Write 2 above the tens.' },
  { diagram: bus('84', 4, '21', 1), text: '4 ones ÷ 4 = 1 one. So 84 ÷ 4 = 21.' },
] })
add(layout, 'Where does short division begin?', bus('96', 3), select(['At the left, with the tens', 'At the right, with the ones'], 0), working('At the left, with the tens.', ['Start with the largest place.', 'In 96, divide the 9 tens first.'], ['Move to the next smaller place.', 'Then divide the 6 ones.']), 'Unlike column multiplication, short division starts with the largest place value.')
add(layout, 'Calculate 96 ÷ 3', bus('96', 3), numeric(32), working('32', ['Divide the tens.', '9 tens ÷ 3 = 3 tens.'], ['Divide the ones.', '6 ones ÷ 3 = 2 ones.']), method)
teach(regroup, 'Exchange a ten without changing the amount', { kind: 'exchange' }, 'To share 72 among 3, first share 6 tens. Exchange the remaining ten so it can join the 2 ones.')
teach(regroup, 'A remaining ten becomes ten ones', { kind: 'worked', initial: bus('72', 3), steps: [
  { diagram: bus('72', 3, '2 ', 0), text: '7 tens ÷ 3 = 2 tens each, with 1 ten left.' },
  { diagram: bus('72', 3, '2 ', 1, { index: 1, value: 1 }), text: 'Exchange that 1 ten for 10 ones. With the next 2 ones, this makes 12 ones.' },
  { diagram: bus('72', 3, '24'), text: '12 ones ÷ 3 = 4 ones. The quotient is 24.' },
] })
add(regroup, 'What moves into the next place?', text('7 tens ÷ 3', '2 tens each, 1 ten left'), select(['The quotient digit 2', 'The remaining 1 ten', 'The original 7 tens'], 1), working('The remaining 1 ten.', ['Separate shared and unshared amounts.', '6 tens have been shared; 1 ten remains.'], ['Regroup what remains.', 'Exchange the remaining ten for 10 ones.']), 'Carry forward only the amount left after sharing, not the amount already shared.')
add(regroup, 'How many ones do we divide next?', bus('72', 3, '2 ', 1, { index: 1, value: 1 }), numeric(12), working('12 ones', ['Exchange the remaining ten.', '1 ten = 10 ones.'], ['Include the next digit.', '10 + 2 = 12 ones.']), 'A small carried digit here represents remaining tens. Convert those tens to ones, then add the next ones digit.')
teach(regroup, 'Sometimes you need the first two digits', { kind: 'worked', initial: bus('288', 9), steps: [
  { diagram: bus('288', 9, undefined, 0), text: '2 hundreds cannot give each of 9 groups a whole hundred. Exchange them for 20 tens.' },
  { diagram: bus('288', 9, ' 3 ', 1), text: '20 tens + 8 tens = 28 tens. 28 ÷ 9 = 3 remainder 1. Write 3 above the tens.' },
  { diagram: bus('288', 9, ' 3 ', 2, { index: 2, value: 1 }), text: 'The remaining ten joins 8 ones to make 18 ones.' },
  { diagram: bus('288', 9, ' 32'), text: '18 ÷ 9 = 2. The quotient is 32; no leading zero is needed.' },
] })
add(regroup, 'Which multiple of 9 is the largest that fits in 23?', text('23 ÷ 9'), select(['18', '27', '9'], 0), working('18', ['Compare nearby multiples.', '9 × 2 = 18; 9 × 3 = 27.'], ['Stay at or below 23.', '18 fits; 27 is too large.']), 'Try successive multiples of 9. Stop before the product goes above 23.')
add(regroup, 'Calculate 234 ÷ 9', bus('234', 9), numeric(26), working('26', ['Divide the first two places.', '23 ÷ 9 = 2 remainder 5. Write 2 in the tens place.'], ['Regroup and finish.', '5 tens + 4 ones = 54 ones; 54 ÷ 9 = 6.']), 'Start with 23 tens. Find the remaining tens, exchange them for ones and include the final 4.', 'independent')
teach(regroup, 'At the end, keep the remainder', { kind: 'worked', initial: bus('67', 5), steps: [
  { diagram: bus('67', 5, '1 ', 0), text: '6 tens ÷ 5 = 1 ten each, with 1 ten left.' },
  { diagram: bus('67', 5, '1 ', 1, { index: 1, value: 1 }), text: '1 ten + 7 ones = 17 ones.' },
  { diagram: bus('67', 5, '13'), text: '17 ÷ 5 = 3 remainder 2. No digits remain, so the answer is 13 remainder 2.' },
] })
add(check, 'Can a final remainder be 5 when dividing by 5?', text('Divisor: 5', 'Proposed remainder: 5'), select(['Yes', 'No — another whole group can be made'], 1), working('No. The remainder must be less than 5.', ['Check whether another group fits.', '5 left over makes one more group of 5.'], ['Use the remainder rule.', 'A remainder is at least 0 and smaller than the divisor.']), 'A remainder means there is not enough left to make another whole group.')
add(regroup, 'Calculate 347 ÷ 5', bus('347', 5), remainder(347, 5), working('69 remainder 2', ['Divide 34 tens.', '34 ÷ 5 = 6 remainder 4.'], ['Regroup with the final 7.', '47 ÷ 5 = 9 remainder 2.']), 'Begin with 34 tens. Regroup the leftover tens with the 7 ones. Enter the whole-number quotient and remainder separately.', 'independent')
add(check, 'Does “13 remainder 2” mean 13.2?', text('67 ÷ 5 = 13 remainder 2'), select(['Yes — put the remainder after a decimal point', 'No — 2 whole ones are left over'], 1), working('No. A remainder is not a decimal digit.', ['Read the remainder as a leftover amount.', '13 groups of 5 use 65, leaving 2 whole ones.'], ['Check the proposed decimal.', '13.2 × 5 = 66, so 13.2 cannot be the answer to 67 ÷ 5.']), 'A remainder counts unshared whole units. A digit after a decimal point represents tenths.', 'transfer')
teach(place, 'Keep the zero that holds a place', { kind: 'worked', initial: bus('408', 4), steps: [
  { diagram: bus('408', 4, '1  ', 0), text: '4 hundreds ÷ 4 = 1 hundred.' },
  { diagram: bus('408', 4, '10 ', 1), text: '0 tens ÷ 4 = 0 tens. Write 0 so the ones will stay in their place.' },
  { diagram: bus('408', 4, '102', 2), text: '8 ones ÷ 4 = 2 ones. The quotient is 102, not 12.' },
] })
add(place, 'A learner writes 824 ÷ 4 = 26. What went wrong?', bus('824', 4), select(['They missed the zero in the tens place', 'They should have started on the right', 'Nothing — 26 is correct'], 0), working('The tens placeholder is missing. 824 ÷ 4 = 206.', ['Divide the hundreds.', '8 ÷ 4 = 2.'], ['Keep the tens column.', '2 tens ÷ 4 gives 0 whole tens. Regroup to 24 ones.'], ['Finish with ones.', '24 ÷ 4 = 6. Write 206.']), 'After writing the first quotient digit, write a digit for every remaining place, even if there are no whole groups there.', 'transfer')
add(place, 'Calculate 612 ÷ 3', bus('612', 3), numeric(204), working('204', ['Divide the hundreds.', '6 ÷ 3 = 2.'], ['Keep zero tens.', '1 ten gives 0 whole tens each; regroup it with 2 ones.'], ['Divide the 12 ones.', '12 ÷ 3 = 4.']), method + ' Keep any zero needed inside the quotient.', 'independent')
teach(check, 'Multiply back and add what is left', { kind: 'worked', initial: text('67 ÷ 5 = 13 remainder 2'), steps: [
  { diagram: text('13 × 5 = 65'), text: 'Multiply the quotient by the divisor to find how much was shared.' },
  { diagram: text('65 + 2 = 67'), text: 'Add the remainder to recover the dividend.' },
  { diagram: text('(13 × 5) + 2 = 67', '0 ≤ 2 < 5'), text: 'Both checks pass: the total matches and the remainder is smaller than the divisor.' },
] })
add(check, 'Which calculation checks this answer?', text('83 ÷ 6 = 13 remainder 5'), select(['13 × 6', '(13 × 6) + 5', '(13 × 5) + 6'], 1), working('(13 × 6) + 5 = 83', ['Recover the shared amount.', '13 × 6 = 78.'], ['Include the remainder.', '78 + 5 = 83; also 5 < 6.']), 'Use quotient × divisor + remainder. This should give the starting dividend.')
add(regroup, 'Calculate 936 ÷ 8', bus('936', 8), numeric(117), working('117', ['Divide hundreds.', '9 ÷ 8 = 1 remainder 1.'], ['Regroup to 13 tens.', '13 ÷ 8 = 1 remainder 5.'], ['Regroup to 56 ones.', '56 ÷ 8 = 7.']), method, 'independent')
add(check, 'Is this answer valid?', text('758 ÷ 7 = 108 remainder 2'), select(['Yes — the inverse check and remainder bound both pass', 'No — a quotient cannot contain zero', 'No — the remainder must be zero'], 0), working('Yes. 758 ÷ 7 = 108 remainder 2.', ['Multiply back and add the remainder.', '108 × 7 + 2 = 756 + 2 = 758.'], ['Check the remainder bound.', '2 is at least 0 and smaller than 7.']), 'Test both conditions: multiply back and add the remainder; then check that the remainder is smaller than 7.', 'transfer')
add(regroup, 'Calculate 965 ÷ 8', bus('965', 8), remainder(965, 8), working('120 remainder 5', ['Divide hundreds.', '9 ÷ 8 = 1 remainder 1.'], ['Divide 16 tens.', '16 ÷ 8 = 2, with no remainder.'], ['Keep the ones place.', '5 ÷ 8 gives 0 whole ones and remainder 5. Check: 120 × 8 + 5 = 965.']), method + ' If the final amount is smaller than 8, write a zero quotient digit and keep that amount as the remainder.', 'independent')
teach('mixed', 'You’ve reached the end', text('Divide → regroup → repeat', 'Keep each quotient digit in place', 'Check: quotient × divisor + remainder'), 'Use the largest places first. Keep placeholder zeroes and a final remainder smaller than the divisor.')
export const shortDivisionVariantB: MethodLesson = { id: 'L004-B', title: 'Short division', level: 'GCSE Foundation', goal: 'Divide whole numbers accurately, regroup by place and check remainders.', states }
