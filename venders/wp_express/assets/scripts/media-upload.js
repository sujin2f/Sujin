function uploadButton(id, frame) {
  frame.on('select', () => {
    const attachment = frame.state().get('selection').first().toJSON();


    jQuery(`section[data-id="${id}"] .img-container`)
      .attr('style', `background-image: url('${attachment.url}');`)
      .removeClass('hidden');
    jQuery(`section[data-id="${id}"] input[type="hidden"]`).val(attachment.id);
    jQuery(`section[data-id="${id}"] .btn-upload`).addClass('hidden');
    jQuery(`section[data-id="${id}"] .btn-remove`).removeClass('hidden');
  });

  frame.open();
}

function removeButton(id) {
  jQuery(`section[data-id="${id}"] .img-container`)
    .attr('style', '')
    .addClass('hidden');
  jQuery(`section[data-id="${id}"] input[type="hidden"]`).val('');
  jQuery(`section[data-id="${id}"] .btn-upload`).removeClass('hidden');
  jQuery(`section[data-id="${id}"] .btn-remove`).addClass('hidden');
}

jQuery(document).ready(($) => {
  const frame = wp.media && wp.media({
    title: 'Select or Upload Media Of Your Chosen Persuasion',
    button: { text: 'Use this media' },
    multiple: false,
  });

  $('.wp-express.field.attachment .btn-upload').click((e) => {
    const id = $(e.currentTarget)
      .parent('.wp-express.field.attachment')
      .attr('data-id');

    e.preventDefault();

    uploadButton(id, frame);
  });

  $('.wp-express.field.attachment .btn-remove').on('click', (e) => {
    const id = $(e.currentTarget)
      .parent('.wp-express.field.attachment')
      .attr('data-id');
    e.preventDefault();

    removeButton(id);
  });

  $('.wp-express.field.attachment .img-container').on('click', (e) => {
    const id = $(e.currentTarget)
      .parent('.wp-express.field.attachment')
      .attr('data-id');
    e.preventDefault();

    removeButton(id);
  });
});
