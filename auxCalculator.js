$(document).ready(
    function initCalculator() {
        var calcModeIsQuantity = $('.radioGroupAuxMode').children(':first-child').is(':checked');
        
        initValues();

        // swap between modes
        $('.calcAuxModeSelect .calcAuxModeButtons .calcAuxRadioButtons input').change(function (event) {
            var btnParent = $(this).parent();
            var textField = $('.calcAuxText');
            var inputField = $('.calcAuxInput');

            if (btnParent.is(':first-child')) {
                $('.calcAuxInputCell').each(function () {
                    $(this).insertBefore($(this).prev('.calcAuxTextCell'));
                });
                calcModeIsQuantity = true;
                clean();
                textField.empty();
                inputField.val('');
            } else {
                $('.calcAuxTextCell').each(function () {
                    $(this).insertBefore($(this).prev('.calcAuxInputCell'));
                });
                calcModeIsQuantity = false;
                clean();
                textField.empty();
                inputField.val('');
            }
            
            initValues();

        });

        // validation
        $('.calcAuxInputCell input').bind('keydown', function (event) {

            // label (result)
            var mt = $('.calcAuxText', $(this).parent().parent());

            // Only numbers allowed (quantity - whole numbers)
            if (calcModeIsQuantity) {
                return isNumberKey(event);

                // Only numbers and commas (the input is the amount, and the quantity is obtained afterwards
                // but must also be validated because should only be whole number)
            } else {

                return isNumberOrDecimalKey(event, this);
            }


        });

        // calculations
        $('.calcAuxInputCell input').keyup(function (event) {
            var specimen = $('.calcAuxSpecimenCell', $(this).parent().parent()).text();

            // input
            var qt = $(this).val();

            // label (result)
            var mt = $('.calcAuxText', $(this).parent().parent());

            // empty
            if (!qt) {
                mt.text('');
                getSums();
            } else {

                if (calcModeIsQuantity) {
                    mt.text(math.eval(qt * specimen));
                } else {
                    var evaluation = math.eval(qt/specimen);

                    // Calculating quantity, should be a whole number
                    if (isWholeNumber(evaluation)) {
                        mt.text(evaluation);
                    } else {
                        mt.text('');
                    }
                }

                getSums();
            }
        });


        // Calculate totals
        function getSums() {
            // Sum
            var billsTotal = 0;
            var coinsTotal = 0;
            var $billsRows = $('tr.calcAuxBillsRow');
            var $coinsRows = $('tr.calcAuxCoinsRow');

            $billsRows.each(function (index) {
                var rowValue = parseInt($(this).find('.calcAuxText').text());
                if (rowValue) {
                    billsTotal += rowValue;
                }

                $('.calcAuxBillsSumValueLabel', $(this).parent()).text(billsTotal);
            });
            $coinsRows.each(function (index) {
                var rowValue = parseInt($(this).find('.calcAuxText').text());
                if (rowValue) {
                    coinsTotal += rowValue;
                }

                $('.calcAuxSumCoinsValueLabel', $(this).parent()).text(coinsTotal);
            });

        }

        function isNumberKey(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode != 8 && charCode != 46 && (charCode < 37 || charCode > 40)
                && (charCode < 48 || charCode > 57))
                return false;

            return true;
        }

        function isNumberOrDecimalKey(evt, element) {
            var key = evt.originalEvent.key;
            
            var lastChar = $(element).val().slice(-1);
            
            
            // digit
            if (/(^\d)/.test(key)) {
                return true;
            }
            if (key === '.' || key === ',') {
                
                newKey = '.';
                if (newKey === lastChar) {
                    return false;
                }   
              var decimalSplit = $(element).val().split(newKey);
              if (decimalSplit.length <= 1) {
                  var elementValue = $(element).val();
                  $(element).val(elementValue.concat(newKey));
                  return false;
              } else {
                  return false;
              } 
            }
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            
            // Backspace, Tab, Delete and Arrows (respectively)
            if (charCode === 8 || charCode === 9 || charCode === 46 || (charCode >= 37 && charCode <= 40)) {
                return true;
            }
            
            return false;
        }

        // Whole numbers
        function isWholeNumber(value) {
            return (value % 1 === 0);
        }
        
        function initValues() {
            $('.calcAuxBillsSumValueLabel').text('0');
            $('.calcAuxSumCoinsValueLabel').text('0');
        }

        // Clean sums
        function clean() {
            $('.calcAuxSumCoinsValueLabel').empty();
            $('.calcAuxBillsSumValueLabel').empty();
        }
    })
